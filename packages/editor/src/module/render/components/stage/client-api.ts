import { message } from 'antd'
import axios from 'axios'
import { AxiosInstance } from 'axios'
import { ApiCore } from './api-core'

class ApiServerPack extends ApiCore {
  protected axios: AxiosInstance
  constructor(protected apiBaseURL: string = '') {
    super({
      info: (str) => message.info(str),
      error: (str) => message.error(str)
    })

    this.axios = axios.create({
      baseURL: apiBaseURL,
      validateStatus: (status) => status < 400
    })
  }

  protected async _submitOperation(requestData) {
    await this.axios.post('/submit-op', requestData)
    return true
  }
}

export default function createApi(apiBaseURL) {
  return new ApiServerPack(apiBaseURL)
}
