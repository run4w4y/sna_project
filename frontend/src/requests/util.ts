import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios'
import createClient from './client'

type DataMapper<D extends object> = (data: any) => D

export type AppRequestConfig<D extends object> = {
  dataMapper: DataMapper<D>
  nullIfNotFound: boolean
  axiosConfig: AxiosRequestConfig<D>
  abortSignal: AbortSignal
}

type RequestF<A, D extends object> = (
  client: AxiosInstance,
  args: A
) => Promise<AxiosResponse<D, any>>
type RequestFactoryResult<A, D extends object> = (
  args: A,
  config?: Partial<AppRequestConfig<D>> | undefined
) => Promise<D | null>

const pickByPriority = <T>(...args: T[]) => {
  for (const arg of args) if (arg !== null && typeof arg !== 'undefined') return arg
  return undefined
}

export const appRequest =
  <A = any, D extends object = any>(config?: Partial<AppRequestConfig<D>>) =>
  <F extends RequestF<A, D>>(fn: F): RequestFactoryResult<A, D> =>
  async (args, callConfig) => {
    const initConfig = config ?? {}
    const resConfig: Partial<AppRequestConfig<D>> = {
      dataMapper: pickByPriority(callConfig?.dataMapper, initConfig.dataMapper),
      nullIfNotFound: pickByPriority(callConfig?.nullIfNotFound, initConfig.nullIfNotFound),
      axiosConfig: pickByPriority(callConfig?.axiosConfig, initConfig.axiosConfig),
      abortSignal: pickByPriority(callConfig?.abortSignal, initConfig.abortSignal),
    }
    const client = createClient({
      axiosConfig: resConfig.axiosConfig,
      signal: resConfig.abortSignal,
    })

    try {
      const res = await fn(client, args)
      return resConfig.dataMapper ? resConfig.dataMapper(res.data) : res.data
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404 && resConfig?.nullIfNotFound)
        return null

      throw err
    }
  }
