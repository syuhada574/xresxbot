/**
 * TESTIMONY IMAGE GENERATOR
 * Generate gambar testimoni profesional untuk XRESX DIGITAL VPN
 * Menggunakan @napi-rs/canvas untuk hasil visual yang menarik
 * (prebuilt binary, tanpa native build dependency)
 */

const { createCanvas } = require('@napi-rs/canvas')
const fs = require('fs')
const path = require('path')

/**
 * Format angka ke format IDR (Rupiah)
 * @param {number} num
 * @returns {string}
 */
function formatRupiah(num) {
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Sensor sebagian digit nomor WhatsApp untuk ditampilkan di gambar testimoni.
 * Contoh: 6285912345307 -> 62859*****307
 * @param {string} numberOrJid - nomor polos atau JID (62xxx@s.whatsapp.net)
 * @returns {string}
 */
function maskPhoneNumber(numberOrJid) {
  if (!numberOrJid) return 'XXXXXXXXXXX'
  const digits = String(numberOrJid).replace(/@.*$/, '').replace(/[^0-9]/g, '')
  if (digits.length < 7) {
    return digits ? `${digits.slice(0, 2)}*****` : 'XXXXXXXXXXX'
  }
  const head = digits.slice(0, 5)
  const tail = digits.slice(-3)
  const maskedLen = Math.max(digits.length - head.length - tail.length, 3)
  return `${head}${'*'.repeat(maskedLen)}${tail}`
}

/**
 * Generate gambar testimoni transaksi (compact landscape)
 * @param {Object} data
 * @param {string} data.customerNumber - Nomor/JID customer asli, akan disensor otomatis untuk tampilan
 * @param {string} data.server - Server (SG/ID)
 * @param {number} data.durasi - Durasi dalam hari
 * @param {number} data.perangkat - Jumlah perangkat/IP
 * @param {number} data.harga - Harga dalam IDR
 * @param {string} data.tanggal - Tanggal transaksi
 * @param {string} data.trx - Nomor transaksi (TRX-0001)
 * @param {string} data.namaPaket - Nama paket
 * @param {string} data.aplikasiVpn - Aplikasi VPN
 * @param {string} data.sshV2ray - SSH atau V2RAY
 * @returns {Buffer} - Buffer gambar PNG
 */
function generateTestimonyImage(data) {
  const { server, durasi, perangkat, harga, tanggal, trx, namaPaket, aplikasiVpn, sshV2ray, customerNumber } = data

  const customerDisplay = maskPhoneNumber(customerNumber)

  const width = 820
  const height = 620
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, '#0f0c29')
  bgGrad.addColorStop(0.5, '#1a1a3e')
  bgGrad.addColorStop(1, '#24243e')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  ctx.globalAlpha = 0.06
  ctx.beginPath()
  ctx.arc(720, 80, 160, 0, Math.PI * 2)
  ctx.fillStyle = '#06b6d4'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(80, 540, 140, 0, Math.PI * 2)
  ctx.fillStyle = '#7c3aed'
  ctx.fill()
  ctx.globalAlpha = 1

  const accentGrad = ctx.createLinearGradient(0, 0, width, 0)
  accentGrad.addColorStop(0, '#06b6d4')
  accentGrad.addColorStop(0.5, '#8b5cf6')
  accentGrad.addColorStop(1, '#06b6d4')
  ctx.fillStyle = accentGrad
  ctx.fillRect(0, 0, width, 4)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('XRESX DIGITAL VPN', width / 2, 40)

  ctx.fillStyle = '#a78bfa'
  ctx.font = '13px sans-serif'
  ctx.fillText('PT SONTOLOYO', width / 2, 60)

  const badgeY = 76
  const badgeW = 220
  const badgeH = 32
  const badgeX = (width - badgeW) / 2

  const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY)
  badgeGrad.addColorStop(0, '#059669')
  badgeGrad.addColorStop(1, '#10b981')
  ctx.fillStyle = badgeGrad

  const r = 16
  ctx.beginPath()
  ctx.moveTo(badgeX + r, badgeY)
  ctx.lineTo(badgeX + badgeW - r, badgeY)
  ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + r)
  ctx.lineTo(badgeX + badgeW, badgeY + badgeH - r)
  ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - r, badgeY + badgeH)
  ctx.lineTo(badgeX + r, badgeY + badgeH)
  ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - r)
  ctx.lineTo(badgeX, badgeY + r)
  ctx.quadraticCurveTo(badgeX, badgeY, badgeX + r, badgeY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('TRANSAKSI BERHASIL', width / 2, badgeY + 21)

  const cardX = 30
  const cardY = 124
  const cardW = width - 60
  const cardH = 430
  const cardR = 12

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
  ctx.beginPath()
  ctx.moveTo(cardX + cardR, cardY)
  ctx.lineTo(cardX + cardW - cardR, cardY)
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + cardR)
  ctx.lineTo(cardX + cardW, cardY + cardH - cardR)
  ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - cardR, cardY + cardH)
  ctx.lineTo(cardX + cardR, cardY + cardH)
  ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - cardR)
  ctx.lineTo(cardX, cardY + cardR)
  ctx.quadraticCurveTo(cardX, cardY, cardX + cardR, cardY)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'
  ctx.lineWidth = 1
  ctx.stroke()

  const colLeftX = cardX + 30
  const colRightX = cardX + cardW / 2 + 15
  const colWidth = cardW / 2 - 45
  const startY = cardY + 35
  const rowH = 52

  const leftRows = [
    { label: 'NO. TRX', value: trx || '-' },
    { label: 'CUSTOMER', value: customerDisplay },
    { label: 'SERVER', value: server === 'SG' ? 'SINGAPORE' : 'INDONESIA' },
    { label: 'DURASI', value: `${durasi} HARI` },
    { label: 'PERANGKAT', value: `${perangkat} IP` },
  ]

  const rightRows = [
    { label: 'HARGA', value: formatRupiah(harga), highlight: true },
    { label: 'PAKET', value: namaPaket || '-' },
    { label: 'APLIKASI', value: aplikasiVpn || '-' },
    { label: 'SSH/V2RAY', value: sshV2ray || '-' },
    { label: 'TANGGAL', value: tanggal || '-' },
  ]

  leftRows.forEach((row, i) => {
    const y = startY + (i * rowH)

    ctx.textAlign = 'left'
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText(row.label, colLeftX, y)

    ctx.fillStyle = row.highlight ? '#34d399' : '#ffffff'
    ctx.font = row.highlight ? 'bold 16px sans-serif' : 'bold 15px sans-serif'
    ctx.fillText(row.value, colLeftX, y + 20)

    if (i < leftRows.length - 1) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(colLeftX, y + 36)
      ctx.lineTo(colLeftX + colWidth, y + 36)
      ctx.stroke()
    }
  })

  rightRows.forEach((row, i) => {
    const y = startY + (i * rowH)

    ctx.textAlign = 'left'
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText(row.label, colRightX, y)

    ctx.fillStyle = row.highlight ? '#34d399' : '#ffffff'
    ctx.font = row.highlight ? 'bold 16px sans-serif' : 'bold 15px sans-serif'
    ctx.fillText(row.value, colRightX, y + 20)

    if (i < rightRows.length - 1) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(colRightX, y + 36)
      ctx.lineTo(colRightX + colWidth, y + 36)
      ctx.stroke()
    }
  })

  ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cardX + cardW / 2, cardY + 20)
  ctx.lineTo(cardX + cardW / 2, cardY + cardH - 20)
  ctx.stroke()

  const statusY = cardY + cardH + 18
  ctx.fillStyle = '#10b981'
  ctx.beginPath()
  ctx.arc(width / 2 - 70, statusY, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#e2e8f0'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Pembayaran Dikonfirmasi', width / 2 - 58, statusY + 4)

  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Terima kasih telah berbelanja di XRESX DIGITAL VPN | Layanan VPN Premium Terpercaya', width / 2, height - 20)

  ctx.fillStyle = accentGrad
  ctx.fillRect(0, height - 4, width, 4)

  return canvas.toBuffer('image/png')
}

module.exports = { generateTestimonyImage, formatRupiah, maskPhoneNumber }
