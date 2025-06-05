const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://2tucho:${password}@cluster0.nuqctwi.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("person", phoneNumberSchema)

const name = process.argv[3]
const number = process.argv[4]

const phoneNumber = new Person({
    name: name,
    number: number,
})

if (process.argv.length < 4) {
    Person.find({}).then(result => {
        result.forEach(number => {
            console.log(number.name, number.number)
        })
        mongoose.connection.close()
    })
} else {
    phoneNumber.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}