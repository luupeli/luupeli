import axios from 'axios'
import getUrl from './urls'
const url = '/api/answers'

let baseUrl = getUrl() + url

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
