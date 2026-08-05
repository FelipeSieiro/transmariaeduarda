import axios from "axios";

const api = axios.create({
  baseURL: "https://transmariaeduardaapi.vercel.app/api/health",
});

export default api;