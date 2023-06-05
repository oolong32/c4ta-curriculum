require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const ejs = require('ejs')
const { body, validationResult } = require('express-validator')

// löschen wenn body geparst wird
// const bodyParser = require('body-parser')

const path = require('path')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const app = express()

app.use(morgan('dev'))

// löschen wenn body geparst wird
// app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json()) // sollte das gleiche tun wie bodyParser
app.use(express.urlencoded({ extended: true }))

app.use(compression()) // compress all routes

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

app.use(helmet({ // security
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "'c4ta.ch'"],
    },
  },
}))

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`╒═════════════════════════════════════════════╕
│                                             │
│ 🚀Listening on http://localhost:${PORT}        │
│ 🤖Note to myself: The Git remote is DOKKU   │
│ 🔥Don’t pull from GitHub!                   │
│                                             │
╘═════════════════════════════════════════════╛`)
})