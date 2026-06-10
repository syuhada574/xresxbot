require('./settings');
const fs = require('fs');
const pino = require('pino');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');
const fetch = require('node-fetch');
const FileType = require('file-type');
const { exec } = require('child_process');
const { say } = require('cfonts')
const { Boom } = require('@hapi/boom');
const { imageToWebp, imageToWebp2, imageToWebp3, videoToWebp, writeExifImg, writeExifImgAV, writeExifVid } = require("./lib/media/sticker.js");


const { default: WAConnection, generateWAMessageFromContent, 
prepareWAMessageMedia, useMultiFileAuthState, Browsers, DisconnectReason, makeInMemoryStore, makeCacheableSignalKeyStore, fetchLatestWaWebVersion, proto, PHONENUMBER_MCC, getAggregateVotesInPollMessage, downloadContentFromMessage } = require('@whiskeysockets/baileys');

const pairingCode = global.pairing_code || process.argv.includes('--pairing-code');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

/*const { cleaningSession } = require("./lib/boostsession");
(async () => {
await setInterval(async () => {
await cleaningSession("./session")
}, 10000)
})()*/

const _cacheFiles = {
  owner:    './database/owner.json',
  antilink: './database/antilink.json',
  antilink2:'./database/antilink2.json',
  welcome:  './database/welcome.json',
  reseller: './database/reseller.json',
  contacts: './database/contacts.json',
}
const _cacheMtime = {}

function loadCaches() {
  if (!global.cache) global.cache = { owner:[], antilink:{}, antilink2:{}, welcome:{}, reseller:[], contacts:[] }
  for (const [key, path] of Object.entries(_cacheFiles)) {
    try {
      const mtime = fs.statSync(path).mtimeMs
      if (_cacheMtime[key] === mtime) continue   // [OPT] file tidak berubah — skip re-read
      _cacheMtime[key] = mtime
      global.cache[key] = JSON.parse(fs.readFileSync(path))
    } catch { /* file belum ada — biarkan nilai sebelumnya */ }
  }
}
loadCaches()
setInterval(loadCaches, 30 * 1000) // refresh tiap 30 detik
//================================================================================

const DataBase = require('./lib/source/database');
const database = new DataBase();
(async () => {
	const loadData = await database.read()
	if (loadData && Object.keys(loadData).length === 0) {
		global.db = {
			users: {},
			groups: {},
			database: {},
			settings : {}, 
			...(loadData || {}),
		}
		await database.write(global.db)
	} else {
		global.db = loadData
	}
	
	setInterval(async () => {
		if (global.db) await database.write(global.db)
	}, 30000) // [FAST] dari 3500ms → 30000ms, kurangi I/O disk
})();

//================================================================================

const { MessagesUpsert, Solving } = require('./lib/source/message')
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep } = require('./lib/function');

//================================================================================

// ── RECONNECT MANAGER ────────────────────────────────────────
// Exponential backoff: cegah spam reconnect saat server WA unstable
let _reconnectDelay = 3000
let _reconnectTimer = null
let _isConnecting = false

// ── GROUP CACHE PREFETCHER ────────────────────────────────────
// Preload semua grup ke cache segera setelah bot ready
// sehingga JPM tidak perlu nunggu groupFetchAllParticipating saat command dikirim
const ALL_GROUPS_CACHE_TTL = 5 * 60 * 1000 // 5 menit
const JPM_START_THRESHOLD  = 1              // mulai JPM segera ada minimal 1 grup valid di cache

// ── INCREMENTAL GROUP CACHE ───────────────────────────────────
// global.allGroupsCache       = {} | null   — hasil fetch sementara yang terus bertambah
// global.allGroupsCacheTime   = number      — timestamp saat fetch selesai PENUH
// global.allGroupsFetching    = boolean     — true saat prefetch sedang berjalan
// global.allGroupsReady       = EventEmitter — dipakai JPM untuk subscribe threshold event

const EventEmitter = require('events')

// Satu emitter global — dibuat sekali, tidak perlu di-reset tiap reconnect
if (!global._groupsEmitter) global._groupsEmitter = new EventEmitter()
global._groupsEmitter.setMaxListeners(30)

// Prefetch incremental: isi allGroupsCache bertahap, emit 'threshold' dan 'done'
async function prefetchAllGroups(conn) {
	if (global.allGroupsFetching) return   // sudah ada yang jalan, skip
	global.allGroupsFetching = true
	global.allGroupsCache = global.allGroupsCache || {}

	try {
		console.log(chalk.cyan('[PREFETCH] Memuat daftar grup ke cache (incremental)...'))

		// groupFetchAllParticipating mengembalikan semua grup sekaligus sebagai object.
		// Kita wrap dengan timeout, lalu emit threshold saat partial fill jika tersedia.
		const fetchPromise = conn.groupFetchAllParticipating()

		// Race: jika 30 detik tidak selesai, lempar error
		const groups = await Promise.race([
			fetchPromise,
			new Promise((_, rej) => setTimeout(() => rej(new Error('prefetch timeout')), 30000))
		])

		// Baileys mengembalikan semua sekaligus — kita masukkan per-batch ke cache
		// agar JPM yang menunggu threshold bisa mulai sesegera mungkin
		const entries = Object.entries(groups)
		const BATCH = 5   // masukkan 5 grup per tick agar event loop tidak tersumbat

		for (let i = 0; i < entries.length; i += BATCH) {
			const slice = entries.slice(i, i + BATCH)
			for (const [id, meta] of slice) {
				global.allGroupsCache[id] = meta
			}
			const filled = Object.keys(global.allGroupsCache).length
			// Emit threshold setelah batch pertama yang memenuhi minimum
			if (filled >= JPM_START_THRESHOLD) {
				global._groupsEmitter.emit('threshold')
			}
			// Yield ke event loop antar batch
			await new Promise(r => setImmediate(r))
		}

		global.allGroupsCacheTime = Date.now()
		global.allGroupsFetching  = false
		global._groupsEmitter.emit('done')
		console.log(chalk.cyan(`[PREFETCH] Cache grup selesai: ${Object.keys(global.allGroupsCache).length} grup.`))

	} catch (e) {
		console.log(chalk.yellow(`[PREFETCH] Gagal memuat cache grup: ${e.message}`))
		global.allGroupsFetching = false
		global.allGroupsCacheTime = 0
		global._groupsEmitter.emit('error', e)
	}
}

// Tunggu sampai threshold terpenuhi atau fetch selesai, lalu kembalikan cache saat itu
// Jika cache sudah fresh dan cukup besar, return langsung (0ms)
async function waitForGroupThreshold(thresholdMs = 20000) {
	const now = Date.now()
	const cacheAge = now - (global.allGroupsCacheTime || 0)
	const cacheSize = Object.keys(global.allGroupsCache || {}).length

	// Cache masih fresh dan lengkap — return instan
	if (global.allGroupsCache && cacheAge < ALL_GROUPS_CACHE_TTL && !global.allGroupsFetching) {
		return global.allGroupsCache
	}

	// Cache sudah punya cukup grup meski fetch belum selesai — return segera
	if (cacheSize >= JPM_START_THRESHOLD) {
		// Pastikan sisa fetch tetap jalan di background (sudah dijalankan oleh pemanggil)
		return global.allGroupsCache
	}

	// Belum cukup grup — tunggu event threshold atau done atau timeout
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			cleanup()
			// Kembalikan apa yang ada meski belum threshold — jangan blok JPM selamanya
			if (global.allGroupsCache && Object.keys(global.allGroupsCache).length > 0) {
				resolve(global.allGroupsCache)
			} else {
				reject(new Error('Timeout menunggu daftar grup. Coba lagi dalam beberapa detik.'))
			}
		}, thresholdMs)

		const onThreshold = () => { cleanup(); resolve(global.allGroupsCache) }
		const onDone      = () => { cleanup(); resolve(global.allGroupsCache) }
		const onError     = (e) => {
			cleanup()
			if (global.allGroupsCache && Object.keys(global.allGroupsCache).length > 0) {
				resolve(global.allGroupsCache)   // ada sebagian grup — tetap lanjut
			} else {
				reject(e)
			}
		}

		function cleanup() {
			clearTimeout(timer)
			global._groupsEmitter.off('threshold', onThreshold)
			global._groupsEmitter.off('done', onDone)
			global._groupsEmitter.off('error', onError)
		}

		global._groupsEmitter.once('threshold', onThreshold)
		global._groupsEmitter.once('done', onDone)
		global._groupsEmitter.once('error', onError)
	})
}

// Entry point untuk case.js — dipanggil via global.getGroupsCached()
async function getGroupsCached(conn) {
	const now = Date.now()
	const cacheAge = now - (global.allGroupsCacheTime || 0)
	const cacheSize = Object.keys(global.allGroupsCache || {}).length

	// Kasus 1: cache fresh dan lengkap — return instan (0ms)
	if (global.allGroupsCache && cacheAge < ALL_GROUPS_CACHE_TTL && !global.allGroupsFetching) {
		return global.allGroupsCache
	}

	// Kasus 2: fetch sedang berjalan, cache sudah punya cukup grup — return sekarang
	if (global.allGroupsFetching && cacheSize >= JPM_START_THRESHOLD) {
		return global.allGroupsCache
	}

	// Kasus 3: cache expired atau kosong — mulai fetch baru, tunggu threshold
	if (!global.allGroupsFetching) {
		global.allGroupsCache = {}   // reset untuk fetch baru
		prefetchAllGroups(conn)      // jalankan di background, tidak di-await
	}

	return waitForGroupThreshold(20000)
}

function scheduleReconnect(label = '') {
	if (_isConnecting) return
	if (_reconnectTimer) clearTimeout(_reconnectTimer)
	console.log(chalk.yellow(`[RECONNECT] ${label} — retry dalam ${_reconnectDelay / 1000}s...`))
	_reconnectTimer = setTimeout(() => {
		_reconnectTimer = null
		startingBot()
	}, _reconnectDelay)
	// Exponential backoff: max 60 detik
	_reconnectDelay = Math.min(_reconnectDelay * 2, 60000)
}

async function startingBot() {
	if (_isConnecting) return
	_isConnecting = true

	const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
	const { state, saveCreds } = await useMultiFileAuthState('./session')

	// [FIX] Selalu gunakan versi fallback — fetch ke github sering timeout di VPS
	let version = [2, 3000, 1035194821]
	try {
		const res = await Promise.race([
			fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json'),
			new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
		])
		const json = await res.json()
		if (Array.isArray(json.version)) version = json.version
	} catch { /* pakai fallback */ }

	const NXL = WAConnection({
		version,
		// [FIX] Browser Chrome lebih stabil untuk multi-device WA
		browser: Browsers.ubuntu('Chrome'),
		getMessage: async (key) => {
			if (store) {
				const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
				return msg?.message || undefined
			}
			return { conversation: 'hallo' }
		},
		printQRInTerminal: !pairingCode,
		generateHighQualityLinkPreview: true,
		logger: pino({ level: 'silent' }),
		auth: {
			creds: state.creds,
			// [FIX] makeCacheableSignalKeyStore cegah memory leak di sesi panjang
			keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
		},
		// [FIX] keepAliveIntervalMs — cegah koneksi mati suri di VPS
		keepAliveIntervalMs: 15000,
		// [FIX] Batasi retry WA internal agar tidak loop sendiri
		retryRequestDelayMs: 2000,
	})

	// ✅ Pairing code
	if (pairingCode && !NXL.authState.creds.registered) {
		console.log(chalk.yellow('\n𖦹 NOMOR : (contoh: 628xxx)'))
		let phoneNumber = await question('')
		phoneNumber = phoneNumber.replace(/[^0-9]/g, '').trim()
		let code = await NXL.requestPairingCode(phoneNumber)
		code = code?.match(/.{1,4}/g)?.join(' - ') || code
		console.log(chalk.magenta.italic('Kode Pairing Kamu :'), chalk.white.bold(code))
	}

//================================================================================

NXL.ev.on('creds.update', saveCreds)

//================================================================================

NXL.ev.on('connection.update', async (update) => {
		const { connection, lastDisconnect, receivedPendingNotifications } = update

		if (connection === 'close') {
			_isConnecting = false
			const err = lastDisconnect?.error
			const reason = new Boom(err)?.output?.statusCode

			// [FIX] Hentikan JPM/SWGC saat disconnect agar loop tidak terus kirim ke socket mati
			global.stopjpm = true
			global.stopswgc = true

			if (reason === DisconnectReason.loggedOut) {
				console.log(chalk.red('[LOGOUT] Sesi habis. Hapus folder session/ dan scan ulang.'))
				exec('rm -rf ./session/*')
				process.exit(1)
			} else if (reason === DisconnectReason.Multidevicemismatch) {
				console.log(chalk.red('[MISMATCH] Multi-device mismatch. Hapus session dan scan ulang.'))
				exec('rm -rf ./session/*')
				process.exit(0)
			} else {
				// Semua alasan lain: reconnect otomatis dengan backoff
				const label = {
					[DisconnectReason.connectionLost]    : 'Connection Lost',
					[DisconnectReason.connectionClosed]  : 'Connection Closed',
					[DisconnectReason.restartRequired]   : 'Restart Required',
					[DisconnectReason.timedOut]          : 'Timed Out',
					[DisconnectReason.badSession]        : 'Bad Session',
					[DisconnectReason.connectionReplaced]: 'Connection Replaced',
				}[reason] || `Unknown (${reason})`
				scheduleReconnect(label)
			}
		}

		if (connection === 'open') {
			// Reset backoff setelah berhasil connect
			_reconnectDelay = 3000
			_isConnecting = false
			global.stopjpm = false
			global.stopswgc = false
			// [FIX] botReady=false dulu — JPM tidak boleh berjalan sampai socket benar-benar stabil
			global.botReady = false
			// Invalidate group cache saat reconnect — data lama mungkin stale
			global.allGroupsCache = {}
			global.allGroupsCacheTime = 0
			global.allGroupsFetching  = false
			// [OPT] Reset cached JIDs — bisa berubah jika session baru
			global._cachedBotNumber    = null
			global._cachedCreatorJids  = null
			global._cachedPremiumJids  = null
			global._qrisCache          = null   // qris path bisa berubah via settings
			console.log(chalk.green.bold(`[CONNECTED] NXL Bot Online ✓`))
			// Safety fallback: jika receivedPendingNotifications tidak pernah muncul
			// (sesi lama yang tidak punya pending), set botReady setelah 20 detik
			if (global._botReadyTimer) clearTimeout(global._botReadyTimer)
			global._botReadyTimer = setTimeout(() => {
				if (!global.botReady) {
					global.botReady = true
					console.log(chalk.cyan('[INFO] Bot siap menerima perintah JPM. (fallback 20s)'))
					// Prefetch groups setelah bot ready
					prefetchAllGroups(NXL)
				}
			}, 20000)
		}

		if (receivedPendingNotifications === true) {
			console.log(chalk.cyan('[INFO] Menerima pending messages, harap tunggu...'))
			// [FIX] Setelah pending selesai, bot benar-benar siap
			// Safety fallback: jika event ini tidak muncul, set ready setelah 20 detik
			if (global._botReadyTimer) clearTimeout(global._botReadyTimer)
			global._botReadyTimer = setTimeout(() => {
				global.botReady = true
				console.log(chalk.cyan('[INFO] Bot siap menerima perintah JPM.'))
				// Prefetch groups di background setelah bot ready — tanpa blocking
				prefetchAllGroups(NXL)
			}, 3000)
		}
	});


store.bind(NXL.ev)
// [FIX FATAL-1] Expose store ke global agar case.js bisa akses global.store.chats (jpmch, cekch, autopromosi)
global.store = store
global._nxlConn = NXL
// [FIX FATAL-2] Expose sleep ke global agar case.js bisa akses global.sleep (pushkontak-response)
global.sleep = (ms) => new Promise(r => setTimeout(r, ms))
// [OPT] Expose getGroupsCached ke global agar JPM pakai cache, bukan fetch ulang setiap saat
global.getGroupsCached = () => getGroupsCached(NXL)

// Baca mode tersimpan dari database/botmode.json saat restart
// Kalau file ada → pakai mode yang terakhir disimpan
// Kalau file belum ada → fallback ke settings.js
try {
	const savedMode = JSON.parse(fs.readFileSync('./database/botmode.json', 'utf-8'))
	NXL.public = typeof savedMode.public === 'boolean' ? savedMode.public : global.NXL !== 'self'
	console.log(chalk.cyan(`[MODE] Bot dimulai dalam mode: ${NXL.public ? 'PUBLIC' : 'SELF'} (dari database/botmode.json)`))
} catch {
	// File belum ada, pakai default dari settings.js
	NXL.public = global.NXL !== 'self'
	console.log(chalk.cyan(`[MODE] Bot dimulai dalam mode: ${NXL.public ? 'PUBLIC' : 'SELF'} (dari settings.js)`))
}

await Solving(NXL, store)
	
//================================================================================
	
NXL.ev.on('messages.upsert', async (message) => {
  // ==================== ANTILINK HANDLER ====================
  try {
    const m = message.messages[0]
    if (!m || m.key.fromMe) return await MessagesUpsert(NXL, message, store)

    const from = m.key.remoteJid
    const isGroup = from?.endsWith('@g.us')
    if (!isGroup) return await MessagesUpsert(NXL, message, store)

    const body = m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      m.message?.videoMessage?.caption || ''

    const sender = m.key.participant || m.key.remoteJid
    const senderNum = sender?.split('@')[0]
    const botNum = NXL.user?.id?.split(':')[0]

    // Jangan proses pesan dari bot sendiri
    if (senderNum === botNum) return await MessagesUpsert(NXL, message, store)

    // [OPT] Cek isOwner dulu (sync, tanpa network) — jika owner, skip groupMetadata sepenuhnya
    const isOwner = (global.cache?.owner || []).map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
    if (isOwner) return await MessagesUpsert(NXL, message, store)

    // [OPT] Cek URL dulu sebelum groupMetadata — jika tidak ada link, tidak perlu fetch admin list
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[^\s]+\.[^\s]+|chat\.whatsapp\.com\/[A-Za-z0-9]+|wa\.me\/\d+|api\.wa\.me\/(?:send\?phone=)?\d+|api\.whatsapp\.com\/send\?[^\s]+|wa\.link\/[A-Za-z0-9]+/gi
    const waLinkRegex = /(?:https?:\/\/)?(?:chat\.whatsapp\.com\/[A-Za-z0-9]+|wa\.me\/\d+|api\.wa\.me\/(?:send\?phone=)?\d+|api\.whatsapp\.com\/send\?[^\s]+|wa\.link\/[A-Za-z0-9]+)/gi
    const hasLink = body ? (urlRegex.test(body) || waLinkRegex.test(body)) : false
    if (!hasLink) return await MessagesUpsert(NXL, message, store)

    // Ada link — baru cek apakah sender adalah admin
    let groupMeta = null
    try { groupMeta = await NXL.groupMetadata(from) } catch {}
    const groupAdmins = groupMeta?.participants?.filter(p => p.admin)?.map(p => p.id) || []
    const isAdmin = groupAdmins.includes(sender)

    if (!isAdmin) {

      const antilinkList  = global.cache?.antilink  || []
      const antilink2List = global.cache?.antilink2 || []

      const isBotAdmin = groupAdmins.some(a => a.split('@')[0] === botNum)

      if (hasLink && isBotAdmin) {
        if (antilinkList.includes(from)) {
          try { await NXL.sendMessage(from, { delete: m.key }) } catch {}
          await NXL.sendMessage(from, {
            text: `⚠️ @${senderNum} dilarang mengirim link di grup ini!\n📵 Pesan telah dihapus.`,
            mentions: [sender]
          })
          return // stop, jangan lanjut ke MessagesUpsert
        }
        if (antilink2List.includes(from)) {
          try { await NXL.sendMessage(from, { delete: m.key }) } catch {}
          await NXL.sendMessage(from, {
            text: `🚫 @${senderNum} dikick karena mengirim link!\n❌ Pesan dihapus & member dikeluarkan.`,
            mentions: [sender]
          })
          try { await NXL.groupParticipantsUpdate(from, [sender], 'remove') } catch {}
          return // stop, jangan lanjut ke MessagesUpsert
        }
      }
    }
  } catch (e) {
    console.error('[ANTILINK ERROR]', e.message)
  }
  // ==================== END ANTILINK ====================

  await MessagesUpsert(NXL, message, store);
});

//================================================================================

NXL.ev.on('contacts.update', (update) => {
		for (let contact of update) {
			let id = NXL.decodeJid(contact.id)
			if (store && store.contacts) {
				const existing = store.contacts[id] || {}
				store.contacts[id] = { ...existing, id, name: contact.notify }
				// Simpan juga lid kalau ada, dipakai resolveToPhoneJid untuk konversi @lid → @s.whatsapp.net
				if (contact.lid) store.contacts[id].lid = contact.lid
			}
		}
});

//================================================================================
	
NXL.ev.on('group-participants.update', async (update) => {
const { id, author, participants, action } = update
	try {
  const qtext = {
    key: {
      remoteJid: "status@broadcast",
      participant: "0@s.whatsapp.net"
    },
    message: {
      "extendedTextMessage": {
        "text": "[ 𝗚𝗿𝗼𝘂𝗽 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 ]"
      }
    }
  }
  // FIX: gunakan global.cache.welcome (array dari welcome.json) bukan global.db.groups
  const welcomeList = global.cache?.welcome || []
  if (welcomeList.includes(id)) {
    const metadata = await NXL.groupMetadata(id)
    let teks
    for(let n of participants) {
      let profile;
      try {
        profile = await NXL.profilePictureUrl(n, 'image');
      } catch {
        profile = 'https://telegra.ph/file/95670d63378f7f4210f03.png';
      }
      let imguser = await prepareWAMessageMedia({
        image: {
          url: profile
        }
      }, {
        upload: NXL.waUploadToServer
      })
      if(action == 'add') {
        teks = author === n ? `@${n.split('@')[0]} join via *link group*` : `@${author.split("@")[0]} telah *menambahkan* @${n.split('@')[0]} kedalam grup`
        let asu = await NXL.sendMessage(id, {
          text: `${teks}`,
          mentions: [author, n]
        }, {
          quoted: qtext
        })
await NXL.relayMessage(id, {
  "productMessage": {
    "product": {
      "productImage": imguser.imageMessage, 
      "productId": "343056591714248",
      "title": "Welcome To Group",
      "description": `Selamat datang @${n.split('@')[0]}`,
      "productImageCount": 1
    },
    "businessOwnerJid": "6283197813991@s.whatsapp.net",
    "contextInfo": {
      mentionedJid: [n]
    }
  }
}, {})
      } else if(action == 'remove') {
        teks = author == n ? `@${n.split('@')[0]} telah *keluar* dari grup` : author !== n ? `@${author.split("@")[0]} telah *mengeluarkan* @${n.split('@')[0]} dari grup` : ""
        let asu = await NXL.sendMessage(id, {
          text: `${teks}`,
          mentions: [author, n]
        }, {
          quoted: qtext
        })
        await NXL.relayMessage(id, {
  "productMessage": {
    "product": {
      "productImage": imguser.imageMessage, 
      "productId": "343056591714248",
      "title": "Leaving To Group",
      "description": `Selamat tinggal @${n.split("@")[0]}`,
      "productImageCount": 1
    },
    "businessOwnerJid": "6283197813991@s.whatsapp.net",
    "contextInfo": {
      mentionedJid: [n]
    }
  }
}, {})
      } else if(action == 'promote') {
        teks = author == n ? `@${n.split('@')[0]} telah *menjadi admin* grup ` : author !== n ? `@${author.split("@")[0]} telah *menjadikan* @${n.split('@')[0]} sebagai *admin* grup` : ""
        let asu = await NXL.sendMessage(id, {
          text: `${teks}`,
          mentions: [author, n]
        }, {
          quoted: qtext
        })
        await NXL.relayMessage(id, {
  "productMessage": {
    "product": {
      "productImage": imguser.imageMessage, 
      "productId": "343056591714248",
      "title": "Promote Member",
      "description": `Promote member @${n.split("@")[0]}`,
      "productImageCount": 1
    },
    "businessOwnerJid": "6283197813991@s.whatsapp.net",
    "contextInfo": {
      mentionedJid: [n]
    }
  }
}, {})
      } else if(action == 'demote') {
        teks = author == n ? `@${n.split('@')[0]} telah *berhenti* menjadi *admin*` : author !== n ? `@${author.split("@")[0]} telah *menghentikan* @${n.split('@')[0]} sebagai *admin* grup` : ""
        let asu = await NXL.sendMessage(id, {
          text: `${teks}`,
          mentions: [author, n]
        }, {
          quoted: qtext
        })
        await NXL.relayMessage(id, {
  "productMessage": {
    "product": {
      "productImage": imguser.imageMessage, 
      "productId": "343056591714248",
      "title": "Demote Member",
      "description": `Demote member @${n.split("@")[0]}`,
      "productImageCount": 1
    },
    "businessOwnerJid": "6283197813991@s.whatsapp.net",
    "contextInfo": {
      mentionedJid: [n]
    }
  }
}, {})
      }
    }
  }
} catch (e) {}
});

//================================================================================

//#STICKER
NXL.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)}
await NXL.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}

NXL.sendImageAsStickerAV = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImgAV(buff, options)
} else {
buffer = await imageToWebp2(buff)}
await NXL.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}

NXL.sendImageAsStickerAvatar = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp3(buff)}
await NXL.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}
 //=================================================//
NXL.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)}
await NXL.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}

NXL.ev.on('groups.update', async (update) => {
		try {
		// Kalau notifGrup off, skip semua notifikasi perubahan grup
		if (global.notifGrup === false) return

		const data = update[0]
		const qtext = {
    key: {
      remoteJid: "status@broadcast",
      participant: "0@s.whatsapp.net"
    },
    message: {
      "extendedTextMessage": {
        "text": "[ 𝗚𝗿𝗼𝘂𝗽 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 ]"
      }
    }
  }
		if (data?.inviteCode) {      
		let botNumber = NXL.user.id.split(":")[0]
		let participant = data.author
		if (participant.split("@")[0] === botNumber) return      
  await NXL.sendMessage(data.id, {text: `@${participant.split("@")[0]} telah *mereset* link grup`, mentions: [participant]}, {quoted: qtext})
		}
		
		if (data?.desc) {
		let botNumber = NXL.user.id.split(":")[0]
		let participant = data.author
		if (participant.split("@")[0] === botNumber) return      
		await NXL.sendMessage(data.id, {text: `@${participant.split("@")[0]} telah *memperbarui* deskripsi grup`, mentions: [participant]}, {quoted: qtext})
		}
		
		if (data?.subject) {
		let botNumber = NXL.user.id.split(":")[0]
		let participant = data.author
		if (participant.split("@")[0] === botNumber) return      
		await NXL.sendMessage(data.id, {text: `@${participant.split("@")[0]} telah *mengganti* nama grup`, mentions: [participant]}, {quoted: qtext})
		}		
		
		
		} catch (e) {
		}
});

     NXL.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        const quoted = message.msg ? message.msg : message;
        const mime = (message.msg || message).mimetype || "";
        const messageType = message.mtype ? message.mtype.replace(/Message/gi, "") : mime.split("/")[0];
        const Randoms = Date.now();
        const fil = Randoms;

        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const type = await FileType.fromBuffer(buffer);
        // [FIX #8] Pastikan folder Tmp ada sebelum menulis file
        if (!fs.existsSync('./Tmp')) fs.mkdirSync('./Tmp', { recursive: true })
        const trueFileName = attachExtension ? `./Tmp/${fil}.${type.ext}` : filename;
        fs.writeFileSync(trueFileName, buffer);

        return trueFileName;
    };

//================================================================================

return NXL

}


startingBot()

// ── MEMORY CLEANUP ────────────────────────────────────────────
setInterval(() => {
	if (global._processedMsgIds && global._processedMsgIds.size > 200) global._processedMsgIds.clear()
	if (global.groupCacheTime) {
		const now = Date.now()
		const TTL = (global.GROUP_CACHE_TTL || 300000) * 2
		for (const jid of Object.keys(global.groupCacheTime)) {
			if (now - global.groupCacheTime[jid] > TTL) {
				delete global.groupCache?.[jid]
				delete global.groupCacheTime[jid]
			}
		}
	}
	if (typeof global.gc === 'function') global.gc()
}, 10 * 60 * 1000)

// ── GROUP CACHE BACKGROUND REFRESH ────────────────────────────
// Refresh allGroupsCache tiap 4 menit (sebelum TTL 5 menit habis)
// Jadi saat JPM dipanggil, cache selalu fresh dan tidak perlu fetch
setInterval(() => {
	if (global.botReady && global._nxlConn) {
		const age = Date.now() - (global.allGroupsCacheTime || 0)
		// Refresh jika cache sudah lebih dari 3.5 menit
		if (age > 3.5 * 60 * 1000) {
			prefetchAllGroups(global._nxlConn).catch(() => {})
		}
	}
}, 4 * 60 * 1000)

// ── GLOBAL ERROR GUARD ────────────────────────────────────────
process.on('uncaughtException', (err) => {
	console.error(chalk.red('[UNCAUGHT]'), err?.message || err)
})
process.on('unhandledRejection', (reason) => {
	console.error(chalk.red('[UNHANDLED]'), reason?.message || reason)
})

// [FIX #1] variable 'file' hilang setelah refactor — define ulang sebelum watchFile
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});