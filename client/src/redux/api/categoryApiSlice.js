import { CATEGORIES_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const categoryApiSlice = apiSlice.injectEndpoints({
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
