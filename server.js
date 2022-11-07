const app = require('./app')
const mongoose = require("mongoose")

require("dotenv").config()

const { HOST_DB, PORT } = process.env

async function main() {
  try {
    if (!HOST_DB) {
      throw new Error("HOST_DB not set!")
    }

    await mongoose.connect(HOST_DB)
    console.log("Database connection successful")

    app.listen(PORT, (err) => {
      if(err) throw err
      console.log(`Server running. Use our API on port: ${PORT}`)
})
  } catch (error) {
    console.error("Error:", error.message)
    process.exit(1)
  }
}

main()