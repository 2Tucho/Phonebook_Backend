const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

//GET ALL PERSONS http://localhost:3001/api/persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//GET INFO http://localhost:3001/info
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${Date()}</p>`)
})

//GET 1 PERSON http://localhost:3001/api/persons/1
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//DELETE 1 PERSON http://localhost:3001/api/persons/1
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id) // La variable id contiene una cadena '1', mientras que los ids de las notas son números enteros
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})