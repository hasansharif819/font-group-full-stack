const express = require("express")
const FontGroupService = require("../services/FontGroupService")

const router = express.Router()

// Create font group
router.post("/", async (req, res, next) => {
  try {
    const fontGroup = await FontGroupService.createFontGroup(req.body)
    res.status(201).json({
      success: true,
      message: "Font group created successfully",
      data: fontGroup,
    })
  } catch (error) {
    next(error)
  }
})

// Get all font groups
router.get("/", async (req, res, next) => {
  try {
    const groups = await FontGroupService.getAllFontGroups()
    res.json({
      success: true,
      data: groups,
      count: groups.length,
    })
  } catch (error) {
    next(error)
  }
})

// Get font group by ID
router.get("/:id", async (req, res, next) => {
  try {
    const group = await FontGroupService.getFontGroupById(req.params.id)
    res.json({
      success: true,
      data: group,
    })
  } catch (error) {
    next(error)
  }
})

// Update font group
router.put("/:id", async (req, res, next) => {
  try {
    const updatedGroup = await FontGroupService.updateFontGroup(req.params.id, req.body)
    res.json({
      success: true,
      message: "Font group updated successfully",
      data: updatedGroup,
    })
  } catch (error) {
    next(error)
  }
})

// Delete font group
router.delete("/:id", async (req, res, next) => {
  try {
    await FontGroupService.deleteFontGroup(req.params.id)
    res.status(204).json({
      success: true,
      message: "Font group deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
