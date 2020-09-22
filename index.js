require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./modules/phonebook')

const app = express()

// 显示静态资源的中间件
app.use(express.static('build'))
app.use(express.json())

// exercise 3.8
morgan.token('postData', req => {
  return Object.keys(req.body).length === 0 && req.body.constructor === Object
    ? ' '
    : JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

// ---------- 后端逻辑部分 ---------------
app.get('/api/persons', (req, res) => {
  // exercise 3.13
  Person.find({}).then(data => {
    res.json(data)
  })
})

// exercise 3.2
app.get('/info', (req, res) => {
  Person.find({}).then(data => {
    res.send(`
      <div>Phonebook has info for ${data.length} people</div>
      <div>${new Date()}</div>
    `)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(data => {
      if (data) {
        res.json(data)
      } else {
        res.status(404).end()
      }
    })
    .catch(e => next(e))

})

// exercise 3.4 
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max))
}

// exercise 3.14
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: "need to provide name."
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: "need to provide number."
    })
  }

  const newP = new Person({
    name: body.name,
    number: body.number
  })

  newP.save()
    .then(data => {
      res.json(data.toJSON())
    }).catch(e => next(e))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person
    .findByIdAndUpdate(req.params.id, person,
      {
        new: true,
        runValidators: true,
        context: 'query'
      })
    .then(updated => {
      res.json(updated)
    })
    .catch(err => next(err))
})

// ------------ 后端事件处理结束 -------------

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// 替代express的原生错误处理器
const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
})