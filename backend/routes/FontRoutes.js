const express = require("express")
const { upload } = require("../middleware/Upload")
const FontService = require("../services/FontService")

const router = express.Router()

// Upload font
router.post("/", upload.single("font"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please select a TTF font file to upload",
      })
    }

    const font = await FontService.createFont(req.file)

    res.status(201).json({
      success: true,
      message: "Font uploaded successfully",
      data: font,
    })
  } catch (error) {
    next(error)
  }
})

// Get all fonts
router.get("/", async (req, res, next) => {
  try {
    const fonts = await FontService.getAllFonts()
    res.json({
      success: true,
      data: fonts,
      count: fonts.length,
    })
  } catch (error) {
    next(error)
  }
})

// Get font by ID
router.get("/:id", async (req, res, next) => {
  try {
    const font = await FontService.getFontById(req.params.id)
    res.json({
      success: true,
      data: font,
    })
  } catch (error) {
    next(error)
  }
})

// Delete font
router.delete("/:id", async (req, res, next) => {
  try {
    await FontService.deleteFont(req.params.id)
    res.status(204).json({
      success: true,
      message: "Font deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
