import axios from 'axios'

const service = axios.create({
  baseURL: 'http://62.60.131.37/', // url = base url + request url
  timeout:20000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
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
