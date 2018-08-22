import axios from 'axios'
const url = '/api/login'
let baseUrl = ''
if (process.env.REACT_APP_ENV === 'production') {
  baseUrl = url
} else if (process.env.REACT_APP_ENV === 'development') {
  baseUrl = 'http://localhost:3001' + url
} else {
  baseUrl = 'http://luupeli-dev.herokuapp.com' + url
}

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }