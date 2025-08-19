import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

router.post('/upload', upload.single('img'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' })
  }

  const originalName = req.file.originalname.split('.').shift()
  const webpName = `${originalName}-${Date.now()}.webp`
  const outPath = path.join(__dirname, '../../uploads', webpName)

  try {
    await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toFile(outPath)
    res.json({ message: 'Archivo convertido a WebP y subido', fileName: webpName })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al convertir la imagen' })
  }
})

router.get('/:img', (req, res) => {
  const filePath = path.join(__dirname, '../../uploads', req.params.img)
  res.sendFile(filePath, err => {
    if (err) res.status(404).send('Imagen no encontrada')
  })
})

export default router
