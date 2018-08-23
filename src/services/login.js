import axios from 'axios'
import getUrl from './urls'
const url = '/api/login'

let baseUrl = getUrl() + url

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }