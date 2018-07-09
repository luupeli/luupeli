import axios from 'axios'
const baseUrl = 'http://luupeli-backend.herokuapp.com/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }