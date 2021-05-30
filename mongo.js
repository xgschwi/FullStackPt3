const mongoose = require('mongoose')

// No password provided
if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const pass = process.argv[2]
const url = `mongodb+srv://Xavier:${pass}@cluster0.eudda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// When only the password is given
if(process.argv.length === 3) {
    console.log('Phonebook:')

    Person.find({}).then(persons => {
        persons.forEach(person => console.log(person.name, person.number))
        mongoose.connection.close()
    })

}

// When name and number are given
if(process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`Added ${person.name} Number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}   