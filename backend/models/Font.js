const mongoose = require("mongoose")

const fontSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  originalName: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
    default: "font/ttf",
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

// Update the updatedAt field before saving
fontSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Instance method to get font URL
fontSchema.methods.getUrl = function () {
  return this.path
}

// Static method to find active fonts
fontSchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ createdAt: -1 })
}

const Font = mongoose.model("Font", fontSchema)

module.exports = Font
