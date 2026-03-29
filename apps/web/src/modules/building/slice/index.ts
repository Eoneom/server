import { getBuilding, listBuildings } from '#building/slice/thunk'
import { RootState } from '#store/index'
import { Building, BuildingItem } from '#types'
import { createSlice, isRejected } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface BuildingState {
  building: Building | null,
  buildings: BuildingItem[]
}

const initialState: BuildingState = {
  building: null,
  buildings: []
}

export const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(listBuildings.fulfilled, (state, action) => {
        state.buildings = action.payload
      })
      .addCase(getBuilding.fulfilled, (state, action) => {
        state.building = action.payload
      })
      .addMatcher(isRejected, (_, action) => {
        toast.error(action.payload as string)
      })
  }
})

export const selectBuildings = (state: RootState) => state.building.buildings
export const selectTotalBuildingsLevel = (state: RootState) => state.building.buildings.reduce((acc, { level }) => acc + level, 0)
export const selectBuildingInProgress = (state: RootState) =>
  state.building.buildings.find((b): b is Extract<BuildingItem, { upgrade_at: number }> => 'upgrade_at' in b)

export const selectBuilding = (state: RootState) => state.building.building
export const selectBuildingCode = (state: RootState) => state.building.building?.code

export const buildingSliceReducer = buildingSlice.reducer
