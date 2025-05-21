import axios from "axios";

const hostname = window.location.hostname;  
//  "localhost" or "192.168.1.7"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `http://${hostname}:5000/api` : "/api",
  withCredentials: true,
});
