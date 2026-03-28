import { getOutpost, listOutposts } from '#outpost/slice/thunk'
import { RootState } from '#store/index'
import { Outpost, OutpostItem } from '#types'
import { createSlice } from '@reduxjs/toolkit'

interface OutpostState {
  outpost: Outpost | null
  outposts: OutpostItem[]
}

const initialState: OutpostState = {
  outpost: null,
  outposts: []
}

const outpostSlice = createSlice({
  name: 'outpost',
  initialState,
  reducers: {
    resetOutpost: state => {
      state.outpost = null
    },
    removeOutpost: (state, action) => {
      state.outposts = state.outposts.filter(outpost => outpost.id !== action.payload)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(listOutposts.fulfilled, (state, action) => {
        state.outposts = action.payload
      })
      .addCase(getOutpost.fulfilled, (state, action) => {
        state.outpost = action.payload
      })
  }
})

export const { resetOutpost, removeOutpost } = outpostSlice.actions

export const selectOutposts = (state: RootState) => state.outpost.outposts

export const selectOutpost = (state: RootState) => state.outpost.outpost
export const selectOutpostId = (state: RootState) => state.outpost.outpost?.id
export const selectOutpostCoordinates = (state: RootState) => state.outpost.outpost?.coordinates

export const outpostSliceReducer = outpostSlice.reducer
