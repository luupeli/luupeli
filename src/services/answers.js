import axios from 'axios'
const url = '/api/answers'
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

const getByUser = (userId) => {
  const request = axios.get(`${baseUrl}/user/${userId}`)
  return request.then(response => { return response })
}

const getByUserAndImage = (userId, imgId) => {
  const request = axios.get(`${baseUrl}/user/${userId}/img/${imgId}`)
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

export default { getAll, get, remove, getByUser, getByUserAndImage }
