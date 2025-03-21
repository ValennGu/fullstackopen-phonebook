require('dotenv').config()
const mongoose = require('mongoose')

const log = (msg) => console.log(`[info] ${msg}`)

// Connecto to DB.
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)

// Generate mongoose schema.
const personSchema = new mongoose.Schema({
  name: String, 
  number: String
})

// Generate mongoose model based on the schema.
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 2) {
  log('Process has been executed only with password.')

  // Get all entries from Person document.
  Person
    .find({})
    .then(people => {
      log('DB Response')
      people.forEach(p => log(`>> ${p.name} ${p.number}`))
      mongoose.connection.close()
      log('Connection closed.')
      log('Exiting process ...')
      process.exit()
    })
} else {
  log('Process has been executed for adding a new entry to phonebook.')
  const name = process.argv[2]
  const number = process.argv[3]

  const person = new Person({
    name: name,
    number: number
  })

  if (!name || !number) {
    log('Missing information.')
    log('Exiting process ...')
    mongoose.connection.close()
    process.exit()
  }

  // Save content to MongoDB.
  person
    .save()
    .then(result => {
      log(`Added ${name} number ${number} to phonebook.`)
      
      // Close the connection.
      mongoose.connection.close()
      log('Connection closed.')
      log('Exiting process ...')
      process.exit()
    })
}