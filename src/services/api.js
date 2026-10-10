import axios from 'axios';
export const API_BASE=import.meta.env.VITE_API_URL||'http://localhost:8081/api';
const api=axios.create({baseURL:API_BASE});
api.interceptors.request.use(c=>{const t=localStorage.getItem('nexus_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c;});
export default api;
