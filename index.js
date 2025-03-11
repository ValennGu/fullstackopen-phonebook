const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 3001

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  res.json(persons)
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
  const count = persons.length
  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${count} people.</p> 
    <p>${date}</p>
  `)
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
