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
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (!person) {
    res.status(404).end()
  }

  res.send(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (!person) {
    res.status(404).end()
  }

  persons = persons.filter(p => p.id !== id)
  res.send(person)
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
    const match = persons.find(p => p.number === body.number)
    
    if (match) {
      res.status(400).send({ error: 'Number already exists in the phonebook.'})
    } else {
      const person = {
        id: String(Math.random()),
        name: body.name,
        number: body.number,
      }

      persons = persons.concat(person)
      res.send(person)
    } 
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
