const express = require("express")
const path = require("path")

const setupStaticFiles = (app) => {
  // Serve static files
  app.use(express.static("public"))

  // Serve font files with proper headers
  app.use(
    "/uploads/fonts",
    express.static(path.join(__dirname, "..", "public", "uploads", "fonts"), {
      setHeaders: (res, path) => {
        if (path.endsWith(".ttf")) {
          res.setHeader("Content-Type", "font/ttf")
          res.setHeader("Access-Control-Allow-Origin", "*")
        }
      },
    }),
  )
}

module.exports = { setupStaticFiles }
