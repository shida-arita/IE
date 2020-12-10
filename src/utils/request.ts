import axios from 'axios'
import store from '@/store'

const service = axios.create({
  baseURL: 'https://alumni-dev.uchaindb.cn/client/', // url = base url + request url
  timeout:20000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (store.getters.getToken) {
      config.headers['Authorization'] = "Bearer "+store.getters.getToken
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // Some example codes here:
    // code == 20000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    const res = response
    if (res.status !== 200) {
      return Promise.reject(new Error(res.data.message || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    switch(error.response.status){
      case 400:
        return error.response.data
      case 401:
        break
        
      case 403:
        break
      default:
    }
    return Promise.reject(error)
  }
)

export default service
