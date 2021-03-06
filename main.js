require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const ejs = require('ejs')
const { body, validationResult } = require('express-validator')
const bodyParser = require('body-parser')
const path = require('path')
const compression = require('compression')
const helmet = require('helmet')

const app = express()

app.use(compression()) // compress all routes
app.use(morgan('dev'))
app.use(helmet()) // security
app.use(bodyParser.urlencoded({ extended: true }))

const environment = app.get('env')
if (environment === "dev") {
  console.log(`environment: ${environment}`)
}

// Static Folder
app.use(express.static('public'))

// View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// import routes
const indexRouter = require('./routes/index')
const schooldayRouter = require('./routes/stundenplan')
const teacherRouter = require('./routes/dozierende')
const apiRouter = require('./routes/api')

// add routes to middleware
app.use('/', indexRouter)
app.use('/stundenplan', schooldayRouter)
app.use('/dozierende', teacherRouter)
app.use('/api', apiRouter)

// MongoDB
const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.on('open', console.log.bind(console, 'MongoDB connection established'))

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})