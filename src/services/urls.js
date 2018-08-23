const getUrl = () => {
  let baseUrl = ''
  if (process.env.REACT_APP_ENV === 'production') {
    baseUrl = ''
  } else if (process.env.REACT_APP_ENV === 'development') {
    baseUrl = 'http://localhost:3001'
  } else {
    baseUrl = 'http://luupeli-dev.herokuapp.com'
  }
  return baseUrl
}



export default getUrl