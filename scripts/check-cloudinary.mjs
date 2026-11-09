
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

try {
  const result = await cloudinary.api.ping()
  console.log('Cloudinary-Verbindung erfolgreich!')
  console.log(result)
} catch (error) {
  console.error('Cloudinary-Verbindung fehlgeschlagen:')
  console.error(error.message)
  process.exitCode = 1
}
