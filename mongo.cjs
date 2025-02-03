const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]


const url =
  `mongodb+srv://fullstack:${password}@cluster0.sb1mi.mongodb.net/numberApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  content: String,
  number: String,
})

const Phonenumber = mongoose.model('Phonenumber', numberSchema)

if (process.argv.length === 3) {
  Phonenumber.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(number => {
      console.log(number.content + ' ' + number.number)
    })
    mongoose.connection.close()
  })
} else {
    const content = process.argv[3]
    const number = process.argv[4]

    const newPhonenumber = new Phonenumber({
      content: content,
      number: number,
    })

    newPhonenumber.save().then(result => {
        console.log('added ' + content + ' number ' + number + ' to phonebook')
        mongoose.connection.close()
    })
}