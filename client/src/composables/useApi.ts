import { useAuthStore } from '@/stores/auth'
import { axiosPrivateInstance } from '@/utils/axios'
import type { AxiosInstance } from 'axios'
import { axiosInstance } from '@/utils/axios'

let isInterceptorSet = false

export function useApiPrivate(): AxiosInstance {
  const authStore = useAuthStore()

  if (!isInterceptorSet) {
    isInterceptorSet = true

    axiosPrivateInstance.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization && authStore.accessToken) {
          config.headers.Authorization = `Bearer ${authStore.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    axiosPrivateInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config

        if (
          (error?.response?.status === 401 || error?.response?.status === 403) &&
          !prevRequest._retry
        ) {
          prevRequest._retry = true

          await authStore.refresh()

          prevRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
          return axiosPrivateInstance(prevRequest)
        }

        return Promise.reject(error)
      }
    )
  }

  return axiosPrivateInstance
}

export function useApi(): AxiosInstance {
  return axiosInstance
}
