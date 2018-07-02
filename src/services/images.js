import axios from 'axios'
const baseUrl = 'http://luupeli-backend.herokuapp.com/api/images'

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

const upload = (newObject) => {
  const request = axios.post(baseUrl + '/upload', newObject, { headers: { enctype: "multipart/form-data" } })
  return request.then(response => { return response })
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => { return response })
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => { return response })
}

export default { getAll, get, create, upload, update, remove }