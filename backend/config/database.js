const mongoose = require("mongoose")
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL

class DatabaseConnection {
  static async connect() {
    try {
      await mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      return true
    } catch (error) {
      console.error("Database connection error:", error)
      throw error
    }
  }

  static async disconnect() {
    try {
      await mongoose.disconnect()
      console.log("Database disconnected")
    } catch (error) {
      console.error("Database disconnection error:", error)
    }
  }
}

const connectDatabase = () => DatabaseConnection.connect()

module.exports = { connectDatabase, DatabaseConnection }
