import axios, { AxiosRequestConfig } from 'axios'
import apiConfig from '@/data/apiConfig'

type CreateClientConfig = {
  axiosConfig?: AxiosRequestConfig | null
  signal?: AbortSignal
}

const createClient = ({ axiosConfig, signal }: CreateClientConfig) => {
  const client = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    baseURL: apiConfig.url,
    signal,
    ...axiosConfig,
  })

  axios.interceptors.request.use((request) => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
  })

  axios.interceptors.response.use((response) => {
    console.log('Response:', JSON.stringify(response, null, 2))
    return response
  })

  return client
}

export default createClient
