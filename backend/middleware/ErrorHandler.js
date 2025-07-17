const multer = require("multer") // Import multer to declare the variable

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: "Font file must be smaller than 5MB",
      })
    }
    return res.status(400).json({
      error: "Upload error",
      message: err.message,
    })
  }

  // Custom validation errors
  if (err.message.includes("Only .ttf files are allowed")) {
    return res.status(400).json({
      error: "Invalid file type",
      message: "Only TTF font files are allowed",
    })
  }

  // MongoDB validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      error: "Validation error",
      message: messages.join(", "),
    })
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      error: "Duplicate entry",
      message: "A record with this name already exists",
    })
  }

  // Default error
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  })
}

module.exports = { errorHandler }
