import axios from 'axios'
const baseUrl = 'http://luupeli-backend.herokuapp.com/api/answers'


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => { return response })
}

const get = (id) => {
  const request = axios.get(`${baseUrl}/${id}`)
  return request.then(response => { return response })
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => { return response })
}

export default { getAll, get, remove }