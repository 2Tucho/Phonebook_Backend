require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("./morgan");
const Person = require("./models/person");
const cors = require("cors");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

// TOKEN PREDEFINIDOS == :method :url :status :res[content-length] - :response-time ms   --->   GET /api/persons 200 223 - 2.551 ms
// TOKEN PERSONALIZADO == :body   --->   Definido en el archivo morgan.js
app.use(morgan(":method :url :status - :res[content-length] :response-time ms :body"));


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
app.get("/api/persons", (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons);
    }).catch(error => next(error));
});

//GET INFO http://localhost:3001/info
app.get("/info", (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(`Phonebook has info for ${persons.length} people ${Date()}`);
    }).catch(error => next(error));
});

//GET 1 PERSON http://localhost:3001/api/persons/1
app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

//DELETE 1 PERSON http://localhost:3001/api/persons/1
app.delete("/api/persons/:id", (request, response, next) => {
    console.log(Person.findByIdAndDelete(request.params.id));

    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

//PUT CHANGE NUMBER http://localhost:3001/api/persons/1
app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body;

    Person.findByIdAndUpdate(request.params.id, { name, number },
        { new: true, runValidators: true, context: "query" }) // Agregamos el parámetro opcional { new: true }, que hará que nuestro controlador de eventos sea llamado con el nuevo documento modificado en lugar del original.
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

//POST NEW PERSON http://localhost:3001/api/persons
app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save()
        .then((savedPerson) => {
            response.json(savedPerson);
        })
        .catch(error => {
            next(error);
        });
});

// Middleware después de nuestras rutas, que se usa para capturar solicitudes realizadas a rutas inexistentes.
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// Controlador de errores
const errorHandler = (error, request, response, next) => {
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    };

    next(error);
};

app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});