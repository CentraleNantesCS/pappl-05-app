import axios,{AxiosRequestConfig} from 'axios'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = true;

const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"


const instance = axios.create({
  baseURL: `${apiUrl}`,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  }
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const { origin } = new URL(config.baseURL!);
    const allowedOrigins = [(new URL(apiUrl)).origin];
    const token = localStorage.getItem('token');
    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


export default instance;