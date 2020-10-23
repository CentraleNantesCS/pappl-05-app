import axios from 'axios'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true;

const api = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"
const instance = axios.create({
  baseURL: `${api}`,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  }
});


export default instance;