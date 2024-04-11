import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from './features/auth/authSlice'
import favoritesReducer from './features/favorites/favoriteSlice'
import { userApiSlice } from './api/userApiSlice'
import { categoryApiSlice } from './api/categoryApiSlice'
import { productApiSlice } from './api/productApiSlice'
import cartReducer from './features/cart/cartSlice'
import shopReducer from './features/shop/shopSlice'
export const store = configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
    shop: shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware, categoryApiSlice.middleware, productApiSlice.middleware),
})
setupListeners(store.dispatch)
