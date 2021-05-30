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

    if(err.name == 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    next(err)
}

app.use(errHandler)

let persons = [
    {
        "name": "Arto Hellas",
        "number": "1356754",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

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


    if(body.name && body.number) { 
        const person ={
            name: body.name,
            number: body.number
        }

        Person.findOne({name: body.name}).then(copy => {

            if(copy === null ) {
                const p = Person(person)
                p.save().then(savedPerson => {
                    response.json(savedPerson)
                })

            }
            else {
                Person.findByIdAndUpdate(copy.id, person, {new: true})
                .then(updatedPerson => {
                    response.json(updatedPerson)
                })
                .catch(err => next(err))
            }
        })
    }
    else {
        return response.status(400).json({ 
            error: 'Name or Number missing'
        })
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})