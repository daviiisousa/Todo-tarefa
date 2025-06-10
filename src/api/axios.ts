import axios from 'axios'

const api = axios.create({
    baseURL: 'https://todo-api-wpkb.onrender.com'
})

export default api