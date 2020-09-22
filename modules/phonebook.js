const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('url', url);

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(res => {
  console.log('connected to MongoDB');
})
.catch(e => {
  console.log('error connecting mongoDB',e);
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
  },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (doc, returnObj) => {
    returnObj.id = returnObj._id.toString()
    delete returnObj._id
    delete returnObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)