require('dotenv').config()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected succesfully to DB'))
  .catch(() => console.log('Unable to connect to DB'))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    minLength: 3,
  },
  number: {
    type: String,
    required: [true, 'Phone number is required.'],
    minLength: 9,
    validate: {
      validator: (v) => /\d{9}/.test(v),
      message: (props) => `${props.value} is not a valid number.`,
    },
  },
}).set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
