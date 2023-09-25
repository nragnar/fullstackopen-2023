require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

// correct order
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
/* var bodyParser = require('body-parser') */

/* 3.7 */
// app.use(morgan('tiny'))
/* 3.8 custom config */
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


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
  },
]

const currentDate = new Date();

let checkPerson = false

/* var logger = morgan('tiny')

const generateID = () => {
  const randomId = Math.floor(Math.random() * 100001); // 1 - 100.000
  return randomId
} */

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name){
    return response.status(400).json({
      error: 'person is missing name'
    })

  }
  if(!body.number){
    return response.status(400).json({
      error: 'person is missing number'
    })
  }
  persons.map(p => {
    if(p.name === body.name){
      checkPerson = true
    }
  })
  if(checkPerson){
    checkPerson = false
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { number: response.number })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})

app.get('/info', (request, response, next) => {

  Person.countDocuments()
    .then(count =>
      response.send(`<p>Phonebook has info for ${count} people<br/>${currentDate}</p>`)
    )
    .catch(error => next(error))
})



app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)



const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: 'malformatted Id' })
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
