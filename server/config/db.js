const { default: mongoose } = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected successfully!')
  } catch (error) {
    handleError(error)
  }
}
module.exports = connectDB
