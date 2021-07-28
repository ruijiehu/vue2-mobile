/* eslint-disable no-extend-native */
import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'
import router from '@/router/index'
// import util from '@/common/util'
const baseURL = (process.env.NODE_ENV === 'development' ? `http://${window.document.location.host}/` : `http://${window.document.location.host}/`)

axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' // 配置请求头
axios.defaults.baseURL = baseURL
window.__axiosPromiseArr = []

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { // author: meizz
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
  if (config.method === 'post' && config.needsQs !== 2) {
    config.data = qs.stringify(config.data)
  }
  // 使用全局的cancalToken，切换路由后取消请求
  config.cancelToken = new axios.CancelToken(cancel => {
    window.__axiosPromiseArr.push({ cancel })
  })
  return config
}, (error) => {
  return Promise.reject(error)
})

// 取消所有的请求
function cancelToken () {
  window.__axiosPromiseArr.forEach((ele, index) => {
    ele.cancel()
    delete window.__axiosPromiseArr[index]
  })
}

let dialogTimer = null

// 返回状态判断（添加响应拦截器）
axios.interceptors.response.use((res) => {
  if (res.data.status) {
    switch (res.data.status) {
      case 401:
        router.push('login')

        if (dialogTimer) {
          clearTimeout(dialogTimer)
        } else {
          dialogTimer = setTimeout(() => {

          }, 1500)
          if (!res.config.url.includes('notNeedTip')) {
            Message({
              type: 'error',
              message: Object.values(res.data.msgs)[0],
              duration: 1500,
              onClose: () => {
              // location.href = '/nanhu-develop/#/login'
                localStorage.removeItem('pageLimitsList')
                location.reload()
              }
            })
          }
        }
        break
      case 404:
      case 400:
        if (!res.config.url.includes('notNeedTip')) Message.error(Object.values(res.data.msgs)[0])
        break
      case 500:
        Message.error(Object.values(res.data.msgs)[0])
        break
      default:
    }
  }
  return res
}, (error) => {
  return Promise.reject(error)
})

// 过滤参数
function filterParam (params) {
  if (params) {
    const paramsCopy = JSON.parse(JSON.stringify(params))
    for (var i in paramsCopy) {
      if (!paramsCopy[i] && paramsCopy[i] !== 0) {
        delete paramsCopy[i]
      }
    }
    return paramsCopy
  } else {
    return Object.create(null)
  }
}

function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

// json参数上传
function postJson (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      baseURL: baseURL,
      data: params,
      withCredentials: true,
      headers: {
        'Content-type': 'application/json;charset=UTF-8'
      },
      needsQs: 2
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}
// 删除方法
function del (url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      data: filterParam(params)
    }).then(response => {
      resolve(response.data)
    },
    err => {
      reject(err)
    })
      .catch((error) => {
        reject(error)
      })
  })
}

// restful请求方式
function restFulApi (url, method, params) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method,
      baseURL: baseURL,
      data: params,
      withCredentials: true,
      headers: {
        'Content-type': 'application/json;charset=UTF-8'
      },
      needsQs: 2
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}
// 参数处理
function serialize (obj) {
  const ary = []
  for (const p in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(p) && (obj[p] || obj[p] === 0)) {
      ary.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return ary.join('&')
}

function get (url, params) {
  const paramFilter = filterParam(params)
  let urlFilter
  if (paramFilter && Object.keys(paramFilter).length !== 0) {
    if (url.indexOf('?') === -1) {
      urlFilter = url + '?' + serialize(paramFilter)
    } else {
      urlFilter = url + '&' + serialize(paramFilter)
    }
  } else {
    urlFilter = url
  }
  return new Promise((resolve, reject) => {
    axios.get(urlFilter).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch(error => {
      reject(error)
    })
  })
}

// 导出excel表格公共方法
function exportExcel (url, params) {
  get(url, params).then(res => {
    if (res.status === 200) {
      location.href = res.data
    } else {
      Message.error(Object.values(res.data.msgs)[0])
    }
  })
}
// 新增方法
function put (url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}
export default {
  /** ****** 这里存放所有的api接口请求方法 ******/
}
export {
  post,
  get,
  postJson,
  restFulApi,
  axios,
  cancelToken,
  del,
  put,
  baseURL,
  exportExcel
}
