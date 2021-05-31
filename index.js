require('dotenv').config()

const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')


app.use(express.static('build'))
app.use(cors())
app.use(express.json())

// Logs content of request
morgan.token('content', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const errHandler = (err, request, response, next) => {
    console.log(errmessage)

    if(err.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    if(err.name === 'ValidatorError') {
        return response.status(400).json({error: err.message})
    }
    next(err)
}

app.use(errHandler)


// Displays all numbers from the people in the phonebook
app.get('/api/persons', (request, response) => {
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

// Displays information about phonebook
app.get('/info', (request, response) => {
    const size = persons.length

    response.send(`<div>
    <p>Phonebook has info for ${size} people </p>
    <p>${new Date}</p>
    </div>`
    )

})

// Display information about a person in phonebook
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(err => next(err))
})

// Deletes a person from the phonebook
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
})

const generateId = () => {
    return Math.round(Math.random()*100000)
}

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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})