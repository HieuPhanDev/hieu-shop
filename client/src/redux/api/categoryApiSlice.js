import { BASE_URL, CATEGORIES_URL } from '../constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const categoryApiSlice = createApi({
  reducerPath: 'categoryApiSlice',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({ url: `${CATEGORIES_URL}/`, method: 'POST', body: data }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({ url: `${CATEGORIES_URL}/${id}`, method: 'PUT', body: data }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `${CATEGORIES_URL}/${id}`, method: 'DELETE' }),
    }),
    getCategories: builder.query({
      query: () => ({ url: `${CATEGORIES_URL}/`, method: 'GET' }),
    }),
    getCategoryById: builder.query({
      query: (id) => ({ url: `${CATEGORIES_URL}/${id}`, method: 'GET' }),
    }),
  }),
})
export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} = categoryApiSlice
