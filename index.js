require('dotenv').config()

const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')

// Logs content of request
morgan.token('content', (req) => {
  return JSON.stringify(req.body)
})

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())




const errHandler = (err, _request, response, next) => {
  if(err.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if(err.name === 'ValidationError') {
    return response.status(400).json({ error: err.message })
  }
  next(err)
}


// Displays all numbers from the people in the phonebook
app.get('/api/persons', (_request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
})

// Delete information about a person in phonebook
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(_result => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

// Creates a new person for the phonebook
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  const p = Person(person)

  p.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(err => next(err))
})


app.use(unknownEndpoint)
app.use(errHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`)
})