import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router/index'
class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig() {
    const config = {
      withCredentials: true,
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }
    return config
  }

  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
    }
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // loading....
        }
        this.queue[url] = true
        return config
      },
      (error) => Promise.reject(error)
    )
    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        this.destroy(url)
        const { data, status } = res
        if (status === 200 && data.status === 200) {
          return data
        } else if (status === 200 && data.status !== 200) {
          Message.closeAll()
          // Message.error(Object.values(data.msgs)[0])
          if ((data.status === 401)||(!data.success)) {
            router.push({ name: 'login' })
          }
          return data
          // return Promise.reject(data)
        }else{
        }
      },
      (error) => {
        // Http 状态码出错
        this.destroy(url)
        return Promise.reject(error)
      }
    )
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
