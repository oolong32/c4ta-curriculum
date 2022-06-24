require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))

console.log(`environment: ${app.get('env')}`)

// MongoDB
const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB)
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