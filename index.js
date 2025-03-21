require('dotenv').config()

const express = require('express')
const morgan = require('morgan')

const app = express()
const Person = require('./models/person')

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(result => {
      res.json(result)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(result => {
      if (!result) {
        res.status(404).send({ error: 'Person not found.'})
      } else {
        res.send(result)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).send('Bad request.')
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(result => {
      if (!result) {
        res.status(404).send({ error: 'Person not found and therefore could not delete.' })
      } else {
        res.send(result)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).send({ error: 'Bad request.' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body) {
    res.status(400).send({ error: 'No body has been provided.'})
  } else if (!body.name) {
    res.status(400).send({ error: 'Mising name.'})
  } else if (!body.number) {
    res.status(400).send({ error: 'Mising number.'})
  } else {
    // TODO: Find if the person already exists in the Database.
    // const match = persons.find(p => p.number === body.number)
    
    // if (match) {
      // res.status(400).send({ error: 'Number already exists in the phonebook.'})
    // } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person
        .save()
        .then(result => res.send(result))
    // } 
  }
})

app.get('/info', (req, res) => {
  const count = 'TODO'
  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${count} people.</p> 
    <p>${date}</p>
  `)
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
