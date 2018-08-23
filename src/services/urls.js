const getUrl = () => {
  let baseUrl = ''
  if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:3001' + url
  } else {
    baseUrl = url
  }
  return baseUrl
}

export default getUrl