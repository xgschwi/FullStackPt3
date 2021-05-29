const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})