const express = require('express')
const app = express()

app.use(express.json())

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
    
    if(request.body.name && request.body.number) { 
        const id = generateId()
        const person = request.body
        person.id = id

        persons.concat(person)
        response.json(person)
    }
    else {
        return response.status(400).json({ 
            error: 'Information missing'
        })
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})