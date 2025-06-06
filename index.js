require('dotenv').config()
const express = require("express")
const app = express()
const morgan = require("./morgan")
const Person = require('./models/person')
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// TOKEN PREDEFINIDOS == :method :url :status :res[content-length] - :response-time ms   --->   GET /api/persons 200 223 - 2.551 ms
// TOKEN PERSONALIZADO == :body   --->   Definido en el archivo morgan.js
app.use(morgan(':method :url :status - :res[content-length] :response-time ms :body'));


// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

//GET ALL PERSONS http://localhost:3001/api/persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
    mongoose.connection.close()
  })
})

//GET INFO http://localhost:3001/info
app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${Person.length} people</p> <p>${Date()}</p>`)
    console.log(Person)
})

//GET 1 PERSON http://localhost:3001/api/persons/1
app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

//DELETE 1 PERSON http://localhost:3001/api/persons/1
app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id) // La variable id contiene una cadena "1", mientras que los ids de las notas son números enteros
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateRandomId = (min, max) => {
    const id = Math.floor(Math.random() * (max - min + 1)) + min
    return id
}

//POST NEW PERSON http://localhost:3001/api/persons
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
    mongoose.connection.close()
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})