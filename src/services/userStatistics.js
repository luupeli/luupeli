import axios from 'axios'
const url = '/api/gamesessions'
let games = ''
if (process.env.REACT_APP_ENV === 'production') {
    games = url
  } else if (process.env.REACT_APP_ENV === 'development') {
    games = 'http://localhost:3001' + url
  } else {
    games = 'http://luupeli-dev.herokuapp.com' + url
  }

const top50 = '/api/gamesessions/top_list_all?limit=50'
let top50Url = ''
if (process.env.REACT_APP_ENV === 'production') {
    top50Url = url
  } else if (process.env.REACT_APP_ENV === 'development') {
    top50Url = 'http://localhost:3001' + url
  } else {
    top50Url = 'http://luupeli-dev.herokuapp.com' + url
  }


const usersBestGames = '/api/gamesessions/top_list_game?limit=50'
let bestGamesUrl = ''
if (process.env.REACT_APP_ENV === 'production') {
    bestGamesUrl = url
  } else if (process.env.REACT_APP_ENV === 'development') {
    bestGamesUrl = 'http://localhost:3001' + url
  } else {
    bestGamesUrl = 'http://luupeli-dev.herokuapp.com' + url
  }

const getTop50 = () => {
    const request = axios.get(top50Url)
    return request.then(response => { return response })
}

const getTotalGamesForIndividual = (userId) => {
    const request = axios.get(`${games}?user=${userId}`)
    return request.then(response => { return response })
}

const getUsersBestGames = (userId) => {
    const request = axios.get(`${bestGamesUrl}&user=${userId}`)
    return request.then(response => { return response })
}

export default { getTop50, getTotalGamesForIndividual, getUsersBestGames }