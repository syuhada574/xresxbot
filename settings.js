/* ============================================================
 * BASE ORI FANNYFA
 * ============================================================
 * BY      : FannyFa
 * VERSION : 1.0
 * BOT     : NXL
 * KODE SC : 11246867678989 ✓
 *
 * CHAT    : 6283171084295
 * SUPPORT : 625624179853
 *
 * THANKS TO:
 *  - FannyFa  [ Developer ]
 *
 * NOTE:
 *  - Yang ori yang ada kode SC-nya ⚙️
 *  - Kami tidak bertanggung jawab atas semua kesalahan
 * ============================================================ */

const fs = require('fs')

// ── PESAN SISTEM ─────────────────────────────────────────────
global.mess = {
  owner   : 'Fitur ini hanya untuk ownerbot.',
  group   : 'Fitur ini hanya dapat digunakan ketika bot berada di dalam grup.',
  private : 'Fitur ini hanya dapat digunakan ketika bot berada di private chat.',
  admin   : 'Fitur ini hanya dapat digunakan admin grup.',
  botadmin: 'Fitur ini hanya dapat digunakan ketika bot menjadi admin grup.',
}


// ── SETTING BOT ───────────────────────────────────────────────
global.prefa      = ['', '!', '.', ',', '🐤', '🗿']
global.ownername  = 'XRESX DIGITAL STORE'
global.namabot    = '*PT SONTOLOYO*'
global.owner      = ['6287728163189']
global.wm         = 'PT SONTOLOYO'
global.versibot   = '2.0'
global.prefix     = '.'
global.NXL        = `` // default mode — akan di-override oleh botmode.json di index.js
global.botMode = `Case`
// ── LINK & URL ────────────────────────────────────────────────
global.url          = ''
global.chjid        = ''
global.urlc1        = ''
global.urlc2        = ''
global.linktambahan = 'vpnlancar.pakde-premium.xyz'
global.linkweb      = 'vpnlancar.pakde-premium.xyz'
global.linkchannel  = ''
global.linkChannel  = ''  // [FIX #1] case.js pakai linkChannel (kapital C) — beda dari linkchannel
global.linkGrup     = ''  // [FIX #1] case.js pakai linkGrup — sebelumnya tidak ada, crash .done/.proses/.ps
global.linkpreview  = 'https://raw.githubusercontent.com/belluptaka/dat3/main/uploads/bb3ff5-1771233100633.jpg'


// ── PAYMENT ───────────────────────────────────────────────────
global.qris       ="./lib/image/payment/qris.jpg"
global.dana      = ''
global.ovo       = ''
global.gopay     = ''
global.rek       = ''
global.storename = ''
global.thumbnail = ''


// ── STICKER ───────────────────────────────────────────────────
global.packname = 'Sticker By'
global.author   = 'PT SONTOLOYO'


// ── AI ────────────────────────────────────────────────────────
global.geminiapi = 'AIzaSyC-bHKyLeYQVt1LG2frmHOoVr2cF5yfe8s'
global.gris      = '`'

global.hfToken = "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"

global.groqKey = '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'

global.promptCoding = `Kamu adalah NXL, asisten coding. Kalau diminta membuat code, balas HANYA dengan code saja tanpa penjelasan, tanpa markdown, tanpa backtick, tanpa komentar tambahan. Langsung tulis codenya saja.`

global.promptUmum = `Saya adalah NXL yang dirancang untuk membantu mahasiswa dalam pembahasan coding serta pelajaran umum seperti Matematika, Bahasa Indonesia, Bahasa Inggris, Fisika, Kimia, Rekayasa Perangkat Lunak, dan Basis Data dengan penjelasan yang mudah dipahami dan relevan`

// ── CACHE TTL & LIMIT ────────────────────────────────────────
global.GROUP_CACHE_TTL = 5 * 60 * 1000  // 5 menit — cache groupMetadata
global.limitawal       = 10              // limit command awal untuk user baru


// ── DELAY & TIMER ─────────────────────────────────────────────
global.JedaSwgc        = 5000
global.JedaPushkontak  = 5000
global.JedaJpm         = 4000


// ── ANTILINK FALLBACK ─────────────────────────────────────────
// [FIX #3] case.js pakai .includes/.push/.splice → harus Array, bukan Object {}
// Nilai ini hanya dipakai kalau file database/antilink.json belum ada
global.antilinkDefault  = []
global.antilink2Default = []

// ── SWGC ──────────────────────────────────────────────────────
global.autoSwgcContent = null
global.stopswgc        = false


// ── CPANEL / API ──────────────────────────────────────────────
global.domain  = 'https://fanny.dk-vpn.xyz'
global.apikey  = 'ptla_XlbPBxUEo9EH0iGOLGmku89PvvW1CueJNe4idphcZej'
global.capikey = 'ptlc_lo6p8PYtMTGdlOOIV3zFa3v2YDCORatakerpFLXgb9C'
global.eggs    = '15'
global.locc    = '1'


// ── LIST PANEL (Harga) ────────────────────────────────────────
global.listpanel = {
  1   : '1000',
  2   : '2000',
  3   : '3000',
  4   : '4000',
  5   : '5000',
  6   : '6000',
  7   : '7000',
  8   : '8000',
  9   : '9000',
  unli: '10000',
}


// ── AUTO RELOAD ───────────────────────────────────────────────
const file = require.resolve(__filename)

fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update ${__filename}`)
  delete require.cache[file]
  require(file)
})
