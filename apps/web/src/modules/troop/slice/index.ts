import { RootState } from '#store/index'
import { createMovement, getMovement, getTroop, listMovements } from '#troop/slice/thunk'
import { Movement, MovementItem, Troop, TroopItem } from '#types'
import { createSlice, isRejected } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'


interface TroopState {
  troop: Troop | null
  troops: TroopItem[]

  movement: Movement | null
  movements: MovementItem[]
}

const initialState: TroopState = {
  troop: null,
  troops: [],
  movement: null,
  movements: []
}

const troopSlice = createSlice({
  name: 'troop',
  initialState,
  reducers: {
    setTroops: (state, action) => {
      state.troops = action.payload
    },
    resetMovement: state => {
      state.movement = null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getTroop.fulfilled, (state, action) => {
        state.troop = action.payload
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

export const { setTroops, resetMovement } = troopSlice.actions

export const selectTroops = (state: RootState) => state.troop.troops
export const selectTroopInProgress = (state: RootState) => state.troop.troops.find(troop => troop.ongoing_recruitment)

export const selectTroop = (state: RootState) => state.troop.troop

export const selectMovement = (state: RootState) => state.troop.movement
export const selectMovements = (state: RootState) => state.troop.movements

export const troopSliceReducer = troopSlice.reducer
