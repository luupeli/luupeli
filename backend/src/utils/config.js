if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let dbUrl = process.env.DATABASE_URL

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  dbUrl = process.env.TEST_DATABASE_URL
}

const getUrl = () => {
  let baseUrl = ''
  if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:3001'
  }
  return baseUrl
 }

module.exports = {
  dbUrl,
  port
}
