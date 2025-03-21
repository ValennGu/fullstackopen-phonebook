require('dotenv').config()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected succesfully to DB'))
  .catch(() => console.log('Unable to connect to DB'))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
}).set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)