require('dotenv').config()
const mongoose = require('mongoose')

// console.log('argv length:',process.argv.length);

// if (process.argv.length < 3) {
//   console.log('please provide mongoDB password: node mango.js <password>');
//   process.exit(1)
// }

// const pwd = process.argv[2]

const url = process.env.MONGODB_URI

console.log('url', url);

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(e => {
  console.log('error', e);
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// 判断执行是查询还是存储
if (process.argv.length === 5) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  newPerson.save().then(result => {
    console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`);
    mongoose.connection.close()
  })
} else {
  // 返回所有成员
  console.log('phonebook:');
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(p.name, p.number);
    })
    mongoose.connection.close()
  })
}

