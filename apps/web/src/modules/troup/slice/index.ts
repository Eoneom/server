import { RootState } from '#store/index'
import { createMovement, getMovement, getTroup, listMovements } from '#troup/slice/thunk'
import { Movement, MovementItem, Troup, TroupItem } from '#types'
import { createSlice, isRejected } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'


interface TroupState {
  troup: Troup | null
  troups: TroupItem[]

  movement: Movement | null
  movements: MovementItem[]
}

const initialState: TroupState = {
  troup: null,
  troups: [],
  movement: null,
  movements: []
}

const troupSlice = createSlice({
  name: 'troup',
  initialState,
  reducers: {
    setTroups: (state, action) => {
      state.troups = action.payload
    },
    resetMovement: state => {
      state.movement = null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getTroup.fulfilled, (state, action) => {
        state.troup = action.payload
      })
      .addCase(listMovements.fulfilled, (state, action) => {
        state.movements = action.payload
      })
      .addCase(getMovement.fulfilled, (state, action) => {
        state.movement = action.payload
      })
      .addCase(createMovement.fulfilled, () => {
        toast.success('Les troupes sont en route')
      })
      .addMatcher(isRejected, (_, action) => {
        toast.error(action.payload as string)
      })
  }
})

export const { setTroups, resetMovement } = troupSlice.actions

export const selectTroups = (state: RootState) => state.troup.troups
export const selectTroupInProgress = (state: RootState) => state.troup.troups.find(troup => troup.ongoing_recruitment)

export const selectTroup = (state: RootState) => state.troup.troup

export const selectMovement = (state: RootState) => state.troup.movement
export const selectMovements = (state: RootState) => state.troup.movements

export const troupSliceReducer = troupSlice.reducer
