const Font = require("../models/Font")
const fs = require("fs").promises
const path = require("path")

class FontService {
  static async createFont(fileData) {
    try {
      const font = new Font({
        name: fileData.originalname.replace(/\.[^/.]+$/, ""), // Remove extension
        originalName: fileData.originalname,
        path: `/uploads/fonts/${fileData.filename}`,
        size: fileData.size,
        mimeType: fileData.mimetype,
      })

      return await font.save()
    } catch (error) {
      // Clean up uploaded file if database save fails
      if (fileData.path) {
        try {
          await fs.unlink(fileData.path)
        } catch (unlinkError) {
          console.error("Failed to clean up file:", unlinkError)
        }
      }
      throw error
    }
  }

  static async getAllFonts() {
    return await Font.findActive()
  }

  static async getFontById(id) {
    const font = await Font.findById(id)
    if (!font || !font.isActive) {
      throw new Error("Font not found")
    }
    return font
  }

  static async deleteFont(id) {
    const font = await Font.findById(id)
    if (!font) {
      throw new Error("Font not found")
    }

    // Soft delete
    font.isActive = false
    await font.save()

    // Optionally delete physical file
    try {
      const filePath = path.join(__dirname, "..", "public", font.path)
      await fs.unlink(filePath)
    } catch (error) {
      console.warn("Could not delete physical font file:", error.message)
    }

    return font
  }

  static async validateFontExists(fontIds) {
    const fonts = await Font.find({
      _id: { $in: fontIds },
      isActive: true,
    })

    if (fonts.length !== fontIds.length) {
      throw new Error("One or more fonts not found")
    }

    return fonts
  }
}

module.exports = FontService
