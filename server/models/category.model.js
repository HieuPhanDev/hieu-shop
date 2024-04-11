const mongoose = require('mongoose') // Erase if already required

var categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLenght: 32,
    },
  },
  {
    timestamps: true,
  }
)

//Export the model
module.exports = mongoose.model('Category', categorySchema)
