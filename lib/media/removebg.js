const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

async function removeBgV1(buffer) {
  try {
    const form = new FormData()
    form.append('file', buffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    })

    const { data } = await axios.post(
      'https://removebg.one/api/predict/v2',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'user-agent': 'Mozilla/5.0 (Linux; Android 10)',
          accept: 'application/json, text/plain, */*',
          'sec-ch-ua': '"Chromium";v="139", "Not;A=Brand";v="99"',
          platform: 'PC',
          'sec-ch-ua-platform': '"Android"',
          origin: 'https://removebg.one',
          referer: 'https://removebg.one/upload'
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    )

    return data?.data?.cutoutUrl || null
  } catch {
    return null
  }
}

async function uploadTmpFilesFromBuffer(buffer, filename = 'image.png') {
  let tmpPath
  try {
    tmpPath = path.join(process.cwd(), `tmp_removebg_${Date.now()}_${filename}`)
    fs.writeFileSync(tmpPath, buffer)

    const form = new FormData()
    form.append('file', fs.createReadStream(tmpPath))

    const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
      headers: form.getHeaders(),
      timeout: 120000
    })

    const url = res?.data?.data?.url
    if (!url) return null

    const idMatch = url.match(/\/(\d+)(?:\/|$)/)
    if (!idMatch) return null

    return `https://tmpfiles.org/dl/${idMatch[1]}/${path.basename(tmpPath)}`
  } catch {
    return null
  } finally {
    if (tmpPath) {
      try { fs.unlinkSync(tmpPath) } catch {}
    }
  }
}

async function removeBgV2(buffer) {
  try {
    const imageUrl = await uploadTmpFilesFromBuffer(buffer)
    if (!imageUrl) return null

    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      origin: 'https://mosyne.ai',
      referer: 'https://mosyne.ai/ai/remove-bg',
      'user-agent': 'Mozilla/5.0'
    }

    const { data: remove } = await axios.post(
      'https://mosyne.ai/api/remove_background',
      { image: imageUrl, user_id: 'user_test' },
      { headers }
    )

    if (!remove?.id) return null

    for (let i = 0; i < 30; i++) {
      await new Promise(res => setTimeout(res, 2000))

      const { data: status } = await axios.post(
        'https://mosyne.ai/api/status',
        { id: remove.id, type: 'remove_background', user_id: 'user_test' },
        { headers }
      )

      if (status?.status === 'COMPLETED' && status?.image) {
        return status.image
      }

      if (status?.status === 'FAILED') return null
    }

    return null
  } catch {
    return null
  }
}

async function removeBgV3(buffer) {
  try {
    // Fallback ke-3: pixian.ai (free, no key needed for low res)
    const form = new FormData()
    form.append('image', buffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    })
    form.append('output.format', 'png')

    const { data } = await axios.post(
      'https://api.pixian.ai/api/v2/remove-background',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        responseType: 'arraybuffer',
        timeout: 30000,
        auth: { username: 'demo', password: 'demo' }
      }
    )

    if (!data || data.byteLength < 100) return null

    // Upload hasil ke tmpfiles biar bisa dipakai getBuffer
    const buf = Buffer.from(data)
    const tmpPath = path.join(process.cwd(), `tmp_rbgv3_${Date.now()}.png`)
    fs.writeFileSync(tmpPath, buf)

    const fdata = new FormData()
    fdata.append('file', fs.createReadStream(tmpPath))

    const res = await axios.post('https://tmpfiles.org/api/v1/upload', fdata, {
      headers: fdata.getHeaders(),
      timeout: 60000
    })

    fs.unlinkSync(tmpPath)

    const url = res?.data?.data?.url
    if (!url) return null

    const idMatch = url.match(/\/(\d+)(?:\/|$)/)
    if (!idMatch) return null

    return `https://tmpfiles.org/dl/${idMatch[1]}/tmp_rbgv3_${Date.now()}.png`
  } catch {
    return null
  }
}

async function removeBgV4(buffer) {
  try {
    // Fallback ke-4: erase.bg (free tier tanpa key)
    const form = new FormData()
    form.append('image_file', buffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    })
    form.append('output_type', 'file')

    const { data } = await axios.post(
      'https://www.erase.bg/api/v1/erase',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'X-Api-Key': 'free',
          'user-agent': 'Mozilla/5.0'
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    )

    if (!data || data.byteLength < 100) return null

    const buf = Buffer.from(data)
    const tmpPath = path.join(process.cwd(), `tmp_rbgv4_${Date.now()}.png`)
    fs.writeFileSync(tmpPath, buf)

    const fdata = new FormData()
    fdata.append('file', fs.createReadStream(tmpPath))

    const res = await axios.post('https://tmpfiles.org/api/v1/upload', fdata, {
      headers: fdata.getHeaders(),
      timeout: 60000
    })

    fs.unlinkSync(tmpPath)

    const url = res?.data?.data?.url
    if (!url) return null

    const idMatch = url.match(/\/(\d+)(?:\/|$)/)
    if (!idMatch) return null

    return `https://tmpfiles.org/dl/${idMatch[1]}/tmp_rbgv4_${Date.now()}.png`
  } catch {
    return null
  }
}

async function removeBg(buffer) {
  const v1 = await removeBgV1(buffer)
  if (v1) return v1

  const v2 = await removeBgV2(buffer)
  if (v2) return v2

  const v3 = await removeBgV3(buffer)
  if (v3) return v3

  const v4 = await removeBgV4(buffer)
  if (v4) return v4

  return null
}

module.exports = {
  removeBg,
  removeBgV1,
  removeBgV2,
  removeBgV3,
  removeBgV4
}