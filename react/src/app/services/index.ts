import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:8000", //http://150.165.167.12:8300/
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;