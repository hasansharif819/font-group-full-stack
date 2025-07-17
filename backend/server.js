const express = require("express")
const cors = require("cors")
const path = require("path")
const { connectDatabase } = require("./config/database")
const fontRoutes = require("./routes/FontRoutes")
const fontGroupRoutes = require("./routes/FontGroupRoutes")
const { errorHandler } = require("./middleware/ErrorHandler")
const { setupStaticFiles } = require("./middleware/StaticFiles")

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 5000
    this.initializeDatabase()
    this.initializeMiddleware()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  async initializeDatabase() {
    try {
      await connectDatabase()
      console.log("✅ Database connected successfully")
    } catch (error) {
      console.error("❌ Database connection failed:", error.message)
      process.exit(1)
    }
  }

  initializeMiddleware() {
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      })
    )
    this.app.use(express.json({ limit: "10mb" }))
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }))
    setupStaticFiles(this.app)
  }

  initializeRoutes() {
    this.app.use("/api/fonts", fontRoutes)
    this.app.use("/api/font-groups", fontGroupRoutes)

    this.app.get("/api/health", (req, res) => {
      res.json({ status: "OK", timestamp: new Date().toISOString() })
    })
  }

  initializeErrorHandling() {
    this.app.use(errorHandler)
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`)
      console.log(`📁 Static files served from: ${path.join(__dirname, "public")}`)
    })
  }
}

// Start server
const server = new Server()
server.start()

module.exports = server
