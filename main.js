require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const ejs = require('ejs')
const { body, validationResult } = require('express-validator')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))

const environment = app.get('env')
if (environment === "dev") {
  console.log(`environment: ${environment}`)
}

// View engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// import routes
const indexRouter = require('./routes/index')
const schooldayRouter = require('./routes/stundenplan')

// add routes to middleware
app.use('/', indexRouter)
app.use('/stundenplan', schooldayRouter)

// MongoDB
const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.on('open', console.log.bind(console, 'MongoDB connection established'))

app.listen(3000, function() {
  // console.log('listening on 3000')
})