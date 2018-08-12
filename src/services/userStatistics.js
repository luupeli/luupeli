import axios from 'axios'
const top50Url = 'http://luupeli-backend.herokuapp.com/api/gamesessions/top_list_all?limit=50'

const getTop50 = () => {
    const request = axios.get(top50Url)
    return request.then(response => { return response })
}

export default { getTop50 }