const cors = require('cors')
const express = require('express')
const app = express()
app.use(cors())
const morgan = require('morgan')

app.use(express.json())

// Logs content of request
morgan.token('content', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
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
    console.log('persons')
    response.json(persons)
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
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
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
app.post('/api/persons', (request, response) => {
    
    const body = request.body


    if(body.name && body.number) { 
        const person = {
            name: body.name,
            number: body.number,
            id: generateId()
        }

        const copy = persons.find(p => p.name === person.name)

        if(!copy) {
            persons = persons.concat(person)
            response.json(person)
        }
        else return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    else {
        return response.status(400).json({ 
            error: 'Name or Number missing'
        })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
    console.log(JSON.stringify(persons))
})