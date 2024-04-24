import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLogged: localStorage.getItem('isLogged') === 'true' || false,
  token: localStorage.getItem('token') || '',
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isLogged = true
      state.token = action.payload.token
      state.userData = action.payload.userData
      localStorage.setItem('isLogged', 'true')
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo))
    },
    logout: (state) => {
      state.isLogged = false
      state.userInfo = null
      state.token = ''
      localStorage.clear()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
