require('dotenv').config()

const express = require('express')
const morgan = require('morgan')

const app = express()
const Person = require('./models/person')

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(result => {
      res.json(result)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(result => {
      if (!result) {
        res.status(404).send({ error: 'Person not found'})
      } else {
        res.send(result)
      }
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndUpdate(req.params.id, { number: req.body.number }, { new: true })
    .then(result => {
      if (!result) {
        res.status(404).send({ error: 'Person not found and therefore could not update'})
      } else {
        res.send(result)
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(result => {
      if (!result) {
        res.status(404).send({ error: 'Person not found and therefore could not delete' })
      } else {
        res.status(204).send(result)
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body) {
    res.status(400).send({ error: 'No body has been provided'})
  } else if (!body.name) {
    res.status(400).send({ error: 'Mising name'})
  } else if (!body.number) {
    res.status(400).send({ error: 'Mising number'})
  } else {
    // TODO: Find if the person already exists in the Database.
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person
      .save()
      .then(result => res.send(result))
      .catch(err => next(err))
  }
})

app.get('/info', (req, res) => {
  Person
    .countDocuments()
    .then(result => {
      res.send(`
        <p>Phonebook has info for ${result} people.</p> 
        <p>${new Date()}</p>
      `)
    })
})

const unkownEndpoint = (req, res) =>
  res.status(404).send({ error: 'Unkown endpoint' })

const errorHandler = (error, req, res, next) =>
  res.status(400).send({
    error: 'Bad request',
    message: error.message
  })

app.use(unkownEndpoint)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
