import axios from "axios";

const hostname = window.location.hostname;

const baseURL =
  import.meta.env.MODE === "development"
    ? `http://${hostname}:5000/api`
    : import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
