import axios from '../utils/axios';


export interface User {
  email: string;
}

export const getConnectedUser = async () => {
  try {
    const response = await axios.get('/api/user')
    return { isAuthenticated: true, user: response.data }
  } catch (e) {
    return { isAuthenticated: false, user: null }
  }
}