import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})


api.interceptors.request.use((config) => {
  const publicEndpoints = ['/users/register/', '/users/login/']
  const isPublic = publicEndpoints.some(url => config.url.includes(url))
  
  const token = localStorage.getItem('access_token')
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api