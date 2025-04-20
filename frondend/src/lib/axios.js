import axios from "axios";

const hostname = window.location.hostname;  
// e.g. "localhost" or "192.168.1.7"

export const axiosInstance = axios.create({
  baseURL: `http://${hostname}:5000/api`,
  withCredentials: true,
});
