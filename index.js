const express = require('express')
const morgan = require('morgan')

const app = express()

let phonebook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  },
]

app.use(express.json())

// 显示静态资源的中间件
app.use(express.static('build'))

// exercise 3.8
morgan.token('postData', req => {
  return Object.keys(req.body).length === 0 && req.body.constructor === Object 
    ? ' ' 
    : JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

// execise 3.7
// app.use(morgan('tiny'))

app.get('/favicon.ico', (req, res) => res.status(204))

// exercise 3.1
app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

// exercise 3.2
app.get('/info', (req,res)=>{
  res.send(`
    <div>Phonebook has info for ${phonebook.length} people</div>
    <div>${new Date()}</div>
  `)
})

// exercise 3.3
app.get('/api/persons/:id', (req,res)=>{
  const id = Number(req.params.id)
  console.log(id);
  const person = phonebook.find(p=>p.id === id)
  console.log(person);

  person ? res.json(person)
    : res.status(404).end()
})

// exercise 3.4 
app.delete('/api/persons/:id', (req,res)=>{
  const id = Number(req.params.id)
  phonebook = phonebook.filter(p => p.id !== id)
  res.status(204).end()
})

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max))
}

// exercise 3.5
app.post('/api/persons', (req,res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: "need to provide name."
    })
  }else if (!body.number){
    return res.status(400).json({
      error: "need to provide number."
    })
  }else if (phonebook.find(p => p.name === body.name)){
    return res.status(400).json({
      error: "name must be unique"
    })
  }

  const newP = {
    id: getRandomInt(10000),
    name: body.name,
    number: body.number
  }

  phonebook = phonebook.concat(newP)
  res.json(newP)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
})