const mongoose = require('mongoose')

const log = (msg) => console.log(`[info] ${msg}`)

// Generate MongoDB string connection with password.
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.zmqnd.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

// Connecto to DB.
mongoose.set('strictQuery', false)
mongoose.connect(url)

// Generate mongoose schema.
const personSchema = new mongoose.Schema({
  name: String, 
  number: String
})

// Generate mongoose model based on the schema.
const Person = mongoose.model('Person', personSchema)

// Process to GET all entries from DB.
if (process.argv.length === 3) {
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
}

// Process to add a new entry to DB.
if (process.argv.length > 3) {
  log('Process has been executed for adding a new entry to phonebook.')
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

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