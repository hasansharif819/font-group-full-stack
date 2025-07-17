const multer = require("multer")
const path = require("path")
const fs = require("fs")

class UploadMiddleware {
  static createStorage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = "public/uploads/fonts"
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")
        cb(null, `${uniqueSuffix}-${sanitizedName}`)
      },
    })
  }

  static fileFilter(req, file, cb) {
    const allowedExtensions = [".ttf"]
    const fileExtension = path.extname(file.originalname).toLowerCase()

    if (!allowedExtensions.includes(fileExtension)) {
      return cb(new Error("Only .ttf files are allowed"), false)
    }

    // Additional MIME type check
    if (file.mimetype !== "font/ttf" && file.mimetype !== "application/octet-stream") {
      return cb(new Error("Invalid file type"), false)
    }

    cb(null, true)
  }

  static createUploadMiddleware() {
    return multer({
      storage: this.createStorage(),
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1,
      },
    })
  }
}

const upload = UploadMiddleware.createUploadMiddleware()

module.exports = { upload, UploadMiddleware }
