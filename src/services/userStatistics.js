import axios from 'axios'
import getUrl from './urls'
const url = '/api/gamesessions'

let games = getUrl() + url

const top50 = '/api/gamesessions/top_list_all?limit=50'
let top50Url = getUrl() + top50

const usersBestGames = '/api/gamesessions/top_list_game?limit=50'
let bestGamesUrl = getUrl() + usersBestGames

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