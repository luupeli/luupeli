import axios from 'axios'
const baseUrl = 'http://luupeli-backend.herokuapp.com/api/bodyParts'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => { return response })
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => { return response })
}

export default { getAll, create }