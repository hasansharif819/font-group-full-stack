const mongoose = require("mongoose")

const fontGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    unique: true,
  },
  fonts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Font",
      required: true,
    },
  ],
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Validation: At least 2 fonts required
fontGroupSchema.pre("save", function (next) {
  if (this.fonts.length < 2) {
    next(new Error("Font group must contain at least 2 fonts"))
  } else {
    this.updatedAt = Date.now()
    next()
  }
})

// Static method to find active groups with populated fonts
fontGroupSchema.statics.findActiveWithFonts = function () {
  return this.find({ isActive: true }).populate("fonts", "name path originalName").sort({ createdAt: -1 })
}

const FontGroup = mongoose.model("FontGroup", fontGroupSchema)

module.exports = FontGroup
