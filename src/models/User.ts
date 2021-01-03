import axios from "../utils/axios";

export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  acronym: string;
  password?: string
}

export const getConnectedUser = async () => {
  try {
    const response = await axios.get("/api/user");
    return { isAuthenticated: true, user: response.data };
  } catch (e) {
    return { isAuthenticated: false, user: null };
  }
};
