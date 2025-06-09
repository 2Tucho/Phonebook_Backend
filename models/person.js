const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, "The name should have at least 3 characters"],
        required: [true, "The name is required"],
        trim: true
    },
    number: {
        type: String,
        required: [true, "The number is required"],
        validate: {
      validator: function(v) {
        return /\d{2,3}-\d+/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
        trim: true
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