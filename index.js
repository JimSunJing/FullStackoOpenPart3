require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./modules/phonebook')

const app = express()

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

app.get('/api/persons', (req, res) => {
  // exercise 3.13
  Person.find({}).then(data => {
    res.json(data)
  })
})

// exercise 3.2
app.get('/info', (req,res)=>{
  Person.find({}).then(data => {
    res.send(`
      <div>Phonebook has info for ${data.length} people</div>
      <div>${new Date()}</div>
    `)
  })
})

app.get('/api/persons/:id', (req,res)=>{
  Person.findById(req.params.id)
    .then(data => {
      res.json(data)
    })

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

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
})