import axios from 'axios'
const url = '/api/login'
let baseUrl = ''
if (process.env.NODE_ENV === 'test') {
  baseUrl = 'http://luupeli-dev.herokuapp.com' + url
} else if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:3001' + url
} else {
  baseUrl = url
}

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }