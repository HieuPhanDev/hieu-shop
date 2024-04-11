import { BASE_URL, PRODUCT_URL, UPLOAD_URL } from '../constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const productApiSlice = createApi({
  reducerPath: 'productApiSlice',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({ url: `${PRODUCT_URL}/`, method: 'POST', body: data }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({ url: `${PRODUCT_URL}/${id}`, method: 'PUT', body: data }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `${PRODUCT_URL}/${id}`, method: 'DELETE' }),
    }),
    getProducts: builder.query({
      query: (params) => ({ url: `${PRODUCT_URL}/`, method: 'GET', params: params }),
    }),
    getProductById: builder.query({
      query: (id) => ({ url: `${PRODUCT_URL}/${id}`, method: 'GET' }),
    }),
    createReview: builder.mutation({
      query: ({ id, data }) => ({ url: `${PRODUCT_URL}/${id}/review`, method: 'POST', body: data }),
    }),
    uploadImage: builder.mutation({
      query: (data) => ({ url: `${UPLOAD_URL}/`, method: 'POST', body: data }),
    }),
  }),
})
export const {
  useCreateProductMutation,
  useCreateReviewMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
  useUploadImageMutation,
} = productApiSlice
