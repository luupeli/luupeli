//This eliminates some copypaste, other services can use getUrl
//to get the appropriate url.

const getUrl = () => {
  let baseUrl = ''
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:3001'
  }
  return baseUrl
 }

 export default getUrl
