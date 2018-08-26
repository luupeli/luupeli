const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')

// Connect to the database and log status
mongoose
  .connect(config.dbUrl)
  .then(() => {
    console.log('connected to database', config.dbUrl)
  })
  .catch(err => {
    console.log(err)
  })

mongoose.Promise = global.Promise

// Configure app to use cors, parser, logger, etc...
app.use(cors())
app.use(require('body-parser').json())
app.use(express.static('build'))
app.use(require('./utils/middleware').logger)
app.use('/api/users', require('./controllers/users'))
app.use('/api/login', require('./controllers/login'))
app.use('/api/bones', require('./controllers/bones'))
app.use('/api/images', require('./controllers/images'))
app.use('/api/animals', require('./controllers/animals'))
app.use('/api/bodyparts', require('./controllers/bodyParts'))
app.use('/api/answers', require('./controllers/answers'))
app.use('/api/best_answers', require('./controllers/bestAnswers'))
app.use('/api/gamesessions', require('./controllers/gameSessions'))
app.use(require('./utils/middleware').error)

// Create a server
const server = http.createServer(app)

// Listen port and log
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

// Close database connection after closing the server
server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}