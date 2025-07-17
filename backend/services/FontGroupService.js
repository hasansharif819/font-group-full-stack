const FontGroup = require("../models/FontGroup")
const FontService = require("./FontService")

class FontGroupService {
  static async createFontGroup(groupData) {
    const { name, fonts, description } = groupData

    // Validate input
    if (!name || !fonts || fonts.length < 2) {
      throw new Error("Group name and at least 2 fonts are required")
    }

    // Validate fonts exist
    await FontService.validateFontExists(fonts)

    // Check if group name already exists
    const existingGroup = await FontGroup.findOne({ name, isActive: true })
    if (existingGroup) {
      throw new Error("Font group with this name already exists")
    }

    const fontGroup = new FontGroup({
      name,
      fonts,
      description,
    })

    return await fontGroup.save()
  }

  static async getAllFontGroups() {
    return await FontGroup.findActiveWithFonts()
  }

  static async getFontGroupById(id) {
    const group = await FontGroup.findById(id).populate("fonts", "name path originalName").exec()

    if (!group || !group.isActive) {
      throw new Error("Font group not found")
    }

    return group
  }

  static async updateFontGroup(id, updateData) {
    const { name, fonts, description } = updateData

    if (!name || !fonts || fonts.length < 2) {
      throw new Error("Group name and at least 2 fonts are required")
    }

    // Validate fonts exist
    await FontService.validateFontExists(fonts)

    // Check if another group with same name exists
    const existingGroup = await FontGroup.findOne({
      name,
      isActive: true,
      _id: { $ne: id },
    })

    if (existingGroup) {
      throw new Error("Font group with this name already exists")
    }

    const updatedGroup = await FontGroup.findByIdAndUpdate(
      id,
      { name, fonts, description, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).populate("fonts", "name path originalName")

    if (!updatedGroup) {
      throw new Error("Font group not found")
    }

    return updatedGroup
  }

  static async deleteFontGroup(id) {
    const group = await FontGroup.findById(id)
    if (!group) {
      throw new Error("Font group not found")
    }

    // Soft delete
    group.isActive = false
    await group.save()

    return group
  }
}

module.exports = FontGroupService
