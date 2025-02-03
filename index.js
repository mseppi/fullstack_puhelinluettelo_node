const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const app = express()
const cors = require('cors')

const Number = require('./models/number.cjs')

let persons = [
]

app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())
app.use(cors())

app.get('/api/persons', (request, response, next) => {
    Number.find({})
        .then(numbers => {
            response.json(numbers)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Number.findById(id)
        .then(number => {
            if (number) {
                response.json(number)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Number.find({})
        .then(numbers => {
            response.send(`<p>Phonebook has info for ${numbers.length} people</p><p>${new Date()}</p>`)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Number.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Number.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Number({
        name: body.name,
        number: body.number
    })

    persons = persons.concat(person)

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})