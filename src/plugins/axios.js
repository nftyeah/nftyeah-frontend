import axios from 'axios'

axios.defaults.timeout = 30000
axios.defaults.baseURL = '/api/'

axios.interceptors.request.use(
  config => {
    // if (store.state.token) {
    //   config.headers.Authorization = `token ${store.state.token}`
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)


axios.interceptors.response.use(
  response => {
    if (response.data.success) {
      return response.data.data;
    }
    let errorData = {
      data: response.data.data,
      message: response.data.error_message,
      code: response.data.error_code,
    }
    return errorData;
  },
  error => {
    console.log(error.response)
    let errorData = {
      data: error.response.data.data,
      message: ''
    }
    switch (error.response.data.error_code) {
      case 1001:
        errorData.message = "error"
        break;
      case 1002:
        errorData.message = "error"
        break;
      case 1003:
        errorData.message = "error"
        break;
      case 2001:
        errorData.message = "error"
        break;
      case 2002:
        errorData.message = "error"
        break;
      case 2003:
        errorData.message = "error"
        break;
      case 2004:
        errorData.message = "already open"
        break;
      default:
        errorData.message = "error"
        break;
    }
    return errorData.data
  }
)

export default axios