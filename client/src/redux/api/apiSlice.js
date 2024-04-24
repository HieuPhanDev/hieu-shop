import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants'
import { logout, setCredentials } from '../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result?.error?.status === 401) {
    console.log('sending refresh token')
    const refreshResult = await baseQuery('/api/user/refresh', api, extraOptions)
    console.log(refreshResult)
    if (refreshResult?.data) {
      const { userInfo } = api.getState().auth
      api.dispatch(setCredentials({ token: refreshResult.data.newAccessToken, userInfo, isLogged: true }))
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
})
