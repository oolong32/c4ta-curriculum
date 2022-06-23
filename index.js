require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))

const mongoDB = "mongodb+srv://c4ta:WGCIqXP4v6I46EL5@c4ta.bnsmypn.mongodb.net/?retryWrites=true&w=majority"

if ('development' === app.get('env')) {
  console.log(`environment: ${app.get('env')}`)
  // const mongoDB = 'mongodb://127.0.0.1:27017/c4ta' // (local)
    mongoose.connect(mongoDB)
  } else {
  // const mongoDB = "mongodb://chawan:f37da6434950dec35d9b27267b717895@dokku-mongo-chawan:27017/c4ta" // actung c4ta existiert noch nicht
  // mongoose.connect(mongoDB, { config: { autoIndex: false }})
}
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.on('open', console.log.bind(console, 'MongoDB connection established'))



app.listen(3000, function() {
  console.log('listening on 3000')
})

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.post('/quotes', (req, res) => {
  console.log(req.body)
})