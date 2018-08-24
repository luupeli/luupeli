import axios from 'axios'
import getUrl from './urls'
const url = '/api/animals'

let baseUrl = getUrl() + url

console.log(process.env)

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => { return response })
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => { return response })
}

export default { getAll, create }