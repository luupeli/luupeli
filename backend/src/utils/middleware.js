// Logs requests to the server
const logger = (request, response, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }
  console.log('---')
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// Gives status 404 and an error message when trying to access incorrect urls
const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  logger,
  error
}