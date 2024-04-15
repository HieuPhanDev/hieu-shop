import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL, USERS_URL } from '../constants'
export const userApiSlice = createApi({
  reducerPath: 'userApiSlice',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({ url: `${USERS_URL}/auth`, method: 'POST', body: data }),
    }),
    logout: builder.mutation({
      query: () => ({ url: `${USERS_URL}/logout`, method: 'POST' }),
    }),
    register: builder.mutation({
      query: (data) => ({ url: `${USERS_URL}`, method: 'POST', body: data }),
    }),
    profile: builder.mutation({
      query: (data) => ({ url: `${USERS_URL}/profile`, method: 'Put', body: data }),
    }),
    getUsers: builder.query({
      query: () => ({ url: `${USERS_URL}`, method: 'GET' }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({ url: `${USERS_URL}/${data.userId}`, method: 'Put', body: data }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({ url: `${USERS_URL}/password/forgot`, method: 'POST', body: data }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, data }) => ({ url: `${USERS_URL}/password/reset/${token}`, method: 'PUT', body: data }),
    }),
  }),
})
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApiSlice
