import { message } from 'antd'
import axios from 'axios'
import { AxiosInstance } from 'axios'
import { ApiCore } from './api-core'

export class ApiServerPack extends ApiCore {
  constructor(apiBaseURL: string = '') {
    super(apiBaseURL, {
      loading: (str) => message.loading(str, 0),
      error: (str) => message.error(str)
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
