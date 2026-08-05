import axios from "axios";

const api = axios.create({
  baseURL: "https://transmariaeduardaapi.vercel.app/api",
});

export default api;