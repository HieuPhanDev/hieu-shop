//packages
const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//ultils
const routes = require('./routes/index.route')
const connectDB = require('./config/db')

const app = express()

app.use(
  cors({
    origin: true, // Cho phép tất cả các nguồn gốc
    credentials: true, // Cho phép gửi cookie qua CORS
  })
)

connectDB()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser())

routes(app)

const port = process.env.PORT || 5004
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
