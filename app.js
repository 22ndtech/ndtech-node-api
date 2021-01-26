const app = require('express')()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

require('dotenv').config({ path: '.env' })
console.log("process.env.NDTECH_NODE_API_DB_SERVER = " + process.env.NDTECH_NODE_API_DB_SERVER);

const mongooseConnectionURI = "mongodb://" + process.env.NDTECH_NODE_API_DB_SERVER + ":27017/" + process.env.NDTECH_NODE_API_DB_NAME;
console.log("mongooseConnectionURI = " + mongooseConnectionURI);
mongoose.connect(mongooseConnectionURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 3000,
  socketTimeoutMS: 4000,
  user: "ndtech-sapper",
  pass: process.env.NDTECH_NODE_API_DB_PASSWORD
})

mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err)
})

require('./models/Story.js')
require('./models/Comment.js')
require('./models/User.js')

require('./handlers/passport')

app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}))

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.end('hello world!')
})

app.use('/', require('./routes/users'))
app.use('/', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

app.use((req, res) => {
  res
    .status(404)
    .json({
      message: 'not found'
    })
})

app.use((err, req, res, next) => {
  let error = {
    status: err.status || 500,
    message: err.message || 'Something went wrong!'
  }
  if (process.env.NODE_ENV === 'development') {
    error['stack'] = err.stack
  }
  res
    .status(err.status || 500)
    .json(error)
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`news app backend is running on port ${port}`))
