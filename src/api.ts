import axios from "axios";

// VITE_BASE_URL로 변경하여 환경 변수 가져오기
const baseURL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
