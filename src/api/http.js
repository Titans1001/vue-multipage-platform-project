// 本文件不允许私自修改，环保除引用第三方接口外一律使用post请求方式，接口定义请参考接口规范书写，这里只做全局http请求状态拦截，其他用户状态一律放行，页面内部做判断自行处理
import axios from 'axios'
import viewDesign from 'view-design'
import {
  baseUrl
} from './url'
import Qs from 'qs'
window.globalHttpUrl = {
  baseURL: baseUrl
}
axios.defaults.timeout = 60000
axios.defaults.baseURL = baseUrl
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
const oldUrl = axios.defaults.baseURL
// 请求拦截
axios.interceptors.request.use(function (config) {
  viewDesign.LoadingBar.start()
  const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, function (error) {
  return Promise.reject(error.response)
})
// axios.interceptors.request.onerror = function handleError() {
//   Promise.reject(createError('Network Error', axios.interceptors.request.config, null, axios.interceptors.request))
// }
axios.interceptors.response.use(function (response) {
  viewDesign.LoadingBar.finish()
  if (response.status === 200) {
    switch (response.data.code) {
      case (401):
        console.log('Unauthorized,表示用户没有权限(令牌、用户名、密码错误)')
        break
      case (400):
        console.log('Invalid Request,用户发出的请求有错误')
        break
      case (403):
        console.log('Forbidden, 表示用户得到授权(与 401 错误相对)，但是访问是被禁止的')
        break
      case (404):
        console.log('Not Found,用户发出的请求针对的是不存在的记录，服务器没有进行操作')
        break
      case (406):
        console.log('Not Acceptable， 用户请求的格式不可得(比如用户请求 JSON格式，但是只有XMLs格式)。')
        break
      case (422):
        console.log('Unprocesable entitz， 当创建一个对象时，发生一个验证错误')
        break
      case (500):
        console.log('Internal Server Error， 服务器发生错误，用户将无法判断发出的请求是否成功。')
        break
      default:
        break
    }
  }
  return response
}, function (error) {
  // 对响应错误做处理
  return {
    data: {
      code: 0,
      errorInfor: error
    },
    code: 0
  }
})
export let Axios = axios
// 封装axios的get请求
export function get(url, params, Origin, openLoading) {
  axios.defaults.baseURL = oldUrl
  if (Origin) {
    axios.defaults.baseURL = Origin
  }
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
      .then(response => {
        // console.log('get', '\n', url, '\n', params, '\n', response)
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 封装axios的post请求
export function post(url, data = {}, Origin, openLoading) {
  axios.defaults.baseURL = oldUrl
  if (Origin) {
    axios.defaults.baseURL = Origin
  }
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(response => {
        console.log('post', '\n', url, 'response', response, '\n', data, '\n', response)
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 封装axios的post请求-序列化
export function postStringify(url, data = {},
  Origin, openLoading) {
  axios.defaults.baseURL = oldUrl
  if (Origin) {
    axios.defaults.baseURL = Origin
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      data: Qs.stringify(data)
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 封装axios的下载数据流转换成excel
export function DownLoadToExcel(url, data = {}, fileName) {
  fileName = fileName + '.xls'
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        responseType: 'blob'
      })
      .then(response => {
        const blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
        resolve()
      })
      .catch(error => {
        console.log(error)
        reject(error)
      })
  })
}
// 封装axios的下载数据流转换成excel
export function DownLoadToFile (url, data = {}, fileName, Origin, openLoading) {
  axios.defaults.baseURL = oldUrl
  if (Origin) {
    axios.defaults.baseURL = Origin
  }
  fileName = fileName + '.xlsx' || 'download.xlsx'
  return new Promise((resolve, reject) => {
    axios
      .get(url, data, {
        'responseType': 'blob',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      })
      .then(response => {
        const blob = new Blob([response.data], {
          type: 'application/octet-stream'
        })
        let objectUrl = URL.createObjectURL(blob)
        if ('download' in document.createElement('a')) {
          let a = document.createElement('a')
          a.setAttribute('href', objectUrl)
          a.setAttribute('download', fileName)
          a.click()
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
        resolve(blob)
      })
      .catch(error => {
        console.log(error)
        reject(error)
      })
  })
}
