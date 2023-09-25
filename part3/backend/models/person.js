const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI


mongoose.connect(url)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^[0-9]{2,3}-[0-9]{4,}$/.test(v);
      },
      message: props => `${props.value} is not a valid number! Valid formats: ##-#####.. or ###-####..`
    }
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

/* const Person = mongoose.model('Person', personSchema) */

/* const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

if (process.argv.length === 5){
    person.save().then(result => {
        console.log("Person saved!")
        mongoose.connection.close()
})

}
if (process.argv.length === 3){
    console.log("phonebook: ")
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
} */