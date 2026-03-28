import { RootState } from '#store/index'
import { createSlice, isRejected } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'


interface AuthState {
  token: string | null
}

const initialState: AuthState = {
  token: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetToken: (state) => {
      state.token = null
    },
    setToken: (state, action) => {
      state.token = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addMatcher(isRejected, (_, action) => {
        toast.error(action.payload as string)
      })
  }
})

export const { resetToken, setToken } = authSlice.actions

export const selectToken = (state: RootState) => state.auth.token

export const authSliceReducer = authSlice.reducer

