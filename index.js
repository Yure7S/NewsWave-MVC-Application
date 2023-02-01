require("./modules/express")
const connectToDatabase = require("./src/database/connect")
const dotenv = require("dotenv")

dotenv.config()

connectToDatabase()