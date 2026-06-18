/**
 * TESTIMONY IMAGE GENERATOR
 * Generate gambar testimoni profesional untuk XRESX DIGITAL VPN
 * Menggunakan canvas untuk hasil visual yang menarik
 */

const { createCanvas, registerFont } = require('canvas')
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
 * Generate gambar testimoni transaksi
 * @param {Object} data
 * @param {string} data.nama - Nama customer
 * @param {string} data.server - Server (SG/ID)
 * @param {number} data.durasi - Durasi dalam hari
 * @param {number} data.perangkat - Jumlah perangkat/IP
 * @param {number} data.harga - Harga dalam IDR
 * @param {string} data.nomor - Nomor customer
 * @param {string} data.tanggal - Tanggal transaksi
 * @param {string} data.trx - Nomor transaksi (TRX-0001)
 * @returns {Buffer} - Buffer gambar PNG
 */
function generateTestimonyImage(data) {
  const { nama, server, durasi, perangkat, harga, nomor, tanggal, trx } = data

  const width = 720
  const height = 1050
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // === BACKGROUND GRADIENT ===
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
  bgGrad.addColorStop(0, '#0f0c29')
  bgGrad.addColorStop(0.5, '#302b63')
  bgGrad.addColorStop(1, '#24243e')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // === DECORATIVE CIRCLES ===
  ctx.globalAlpha = 0.08
  ctx.beginPath()
  ctx.arc(600, 100, 200, 0, Math.PI * 2)
  ctx.fillStyle = '#00d4ff'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(100, 850, 180, 0, Math.PI * 2)
  ctx.fillStyle = '#7c3aed'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(650, 750, 120, 0, Math.PI * 2)
  ctx.fillStyle = '#06b6d4'
  ctx.fill()

  ctx.globalAlpha = 1

  // === TOP ACCENT LINE ===
  const accentGrad = ctx.createLinearGradient(0, 0, width, 0)
  accentGrad.addColorStop(0, '#06b6d4')
  accentGrad.addColorStop(0.5, '#8b5cf6')
  accentGrad.addColorStop(1, '#06b6d4')
  ctx.fillStyle = accentGrad
  ctx.fillRect(0, 0, width, 5)

  // === HEADER SECTION ===
  // Brand name
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('XRESX DIGITAL VPN', width / 2, 60)

  // Sub brand
  ctx.fillStyle = '#a78bfa'
  ctx.font = '16px sans-serif'
  ctx.fillText('PT SONTOLOYO', width / 2, 88)

  // === DIVIDER LINE ===
  ctx.strokeStyle = '#4c1d95'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(60, 110)
  ctx.lineTo(width - 60, 110)
  ctx.stroke()

  // === SUCCESS BADGE ===
  const badgeY = 150
  const badgeW = 300
  const badgeH = 44
  const badgeX = (width - badgeW) / 2

  const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY)
  badgeGrad.addColorStop(0, '#059669')
  badgeGrad.addColorStop(1, '#10b981')
  ctx.fillStyle = badgeGrad

  // Rounded rect for badge
  const radius = 22
  ctx.beginPath()
  ctx.moveTo(badgeX + radius, badgeY)
  ctx.lineTo(badgeX + badgeW - radius, badgeY)
  ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + radius)
  ctx.lineTo(badgeX + badgeW, badgeY + badgeH - radius)
  ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - radius, badgeY + badgeH)
  ctx.lineTo(badgeX + radius, badgeY + badgeH)
  ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - radius)
  ctx.lineTo(badgeX, badgeY + radius)
  ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('TRANSAKSI BERHASIL', width / 2, badgeY + 28)

  // === MAIN CARD ===
  const cardX = 40
  const cardY = 220
  const cardW = width - 80
  const cardH = 650
  const cardR = 16

  // Card background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
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

  // Card border
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // === DATA ROWS ===
  const startY = cardY + 50
  const lineHeight = 72
  const labelX = cardX + 35
  const valueX = cardX + cardW - 35

  const rows = [
    { label: 'NO. TRX', value: trx || '-', highlight: false },
    { label: 'CUSTOMER', value: nama || '-' },
    { label: 'NOMOR', value: nomor || '-' },
    { label: 'SERVER', value: server === 'SG' ? 'SINGAPORE' : 'INDONESIA' },
    { label: 'DURASI', value: `${durasi} HARI` },
    { label: 'PERANGKAT', value: `${perangkat} IP` },
    { label: 'HARGA', value: formatRupiah(harga), highlight: true },
    { label: 'TANGGAL', value: tanggal || '-' },
  ]

  rows.forEach((row, i) => {
    const y = startY + (i * lineHeight)

    // Label
    ctx.textAlign = 'left'
    ctx.fillStyle = '#94a3b8'
    ctx.font = '14px sans-serif'
    ctx.fillText(row.label, labelX, y)

    // Value
    ctx.textAlign = 'right'
    if (row.highlight) {
      ctx.fillStyle = '#34d399'
      ctx.font = 'bold 22px sans-serif'
    } else {
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px sans-serif'
    }
    ctx.fillText(row.value, valueX, y)

    // Separator line
    if (i < rows.length - 1) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(labelX, y + 22)
      ctx.lineTo(valueX, y + 22)
      ctx.stroke()
    }
  })

  // === STATUS INDICATOR ===
  const statusY = cardY + cardH + 30
  ctx.fillStyle = '#10b981'
  ctx.beginPath()
  ctx.arc(width / 2 - 60, statusY, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#e2e8f0'
  ctx.font = '15px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Pembayaran Dikonfirmasi', width / 2 - 46, statusY + 5)

  // === FOOTER ===
  const footerY = height - 80
  ctx.strokeStyle = '#4c1d95'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(60, footerY)
  ctx.lineTo(width - 60, footerY)
  ctx.stroke()

  ctx.fillStyle = '#64748b'
  ctx.font = '13px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Terima kasih telah berbelanja di XRESX DIGITAL VPN', width / 2, footerY + 30)
  ctx.fillText('Layanan VPN Premium Terpercaya', width / 2, footerY + 52)

  // === BOTTOM ACCENT LINE ===
  ctx.fillStyle = accentGrad
  ctx.fillRect(0, height - 5, width, 5)

  return canvas.toBuffer('image/png')
}

module.exports = { generateTestimonyImage, formatRupiah }
