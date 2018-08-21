import axios from 'axios'
const url = '/api/gamesessions'
let games = ''
if (process.env.NODE_ENV === 'test') {
  games = 'http://luupeli-dev.herokuapp.com' + url
} else if (process.env.NODE_ENV === 'development') {
  games = 'http://localhost:3001' + url
} else {
    games = url
}

const top50 = '/api/gamesessions/top_list_all?limit=50'
let top50Url = ''
if (process.env.NODE_ENV === 'test') {
  top50Url = 'http://luupeli-dev.herokuapp.com' + top50
} else if (process.env.NODE_ENV === 'development') {
    top50Url = 'http://localhost:3001' + top50
} else {
    top50Url = top50
}


const usersBestGames = '/api/gamesessions/top_list_game?limit=50'
let bestGamesUrl = ''
if (process.env.NODE_ENV === 'test') {
    bestGamesUrl = 'http://luupeli-dev.herokuapp.com' + usersBestGames
} else if (process.env.NODE_ENV === 'development') {
    bestGamesUrl = 'http://localhost:3001' + usersBestGames
} else {
    bestGamesUrl = usersBestGames
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