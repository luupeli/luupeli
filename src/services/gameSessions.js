import axios from 'axios'
const url = '/api/gamesessions'
let baseUrl = ''
if (process.env.REACT_APP_ENV === 'production') {
  baseUrl = url
} else if (process.env.REACT_APP_ENV === 'development') {
  baseUrl = 'http://localhost:3001' + url
} else {
  baseUrl = 'http://luupeli-dev.herokuapp.com' + url
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => { return response })
}

const get = (id) => {
  const request = axios.get(`${baseUrl}/${id}`)
  return request.then(response => { return response })
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => { return response })
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => { return response })
}

export default { getAll, get, create, remove }