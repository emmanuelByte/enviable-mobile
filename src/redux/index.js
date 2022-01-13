import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useReducer } from 'react'
import userReducer from '@src/redux/slices/userSlice'

export default configureStore({
  reducer: combineReducers({
    user: userReducer,
})
})