import { City, CityItem } from '#types'
import { createSlice, isRejected } from '@reduxjs/toolkit'
import { RootState } from '#store/index'
import { getCity, listCities } from '#city/slice/thunk'
import { toast } from 'react-toastify'

interface CityState {
  city: City | null,
  cities: CityItem[]
}

const initialState: CityState = {
  city: null,
  cities: [],
}

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    resetCity: (state) => {
      state.city = null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(listCities.fulfilled, (state, action) => {
        state.cities = action.payload ?? []
      })
      .addCase(getCity.fulfilled, (state, action) => {
        state.city = action.payload
      })
      .addMatcher(isRejected, (_, action) => {
        toast.error(action.payload as string)
      })
  }
})

export const { resetCity } = citySlice.actions

export const selectCity = (state: RootState) => state.city.city
export const selectCityId = (state: RootState) => state.city.city?.id
export const selectCityCoordinates = (state: RootState) => state.city.city?.coordinates

export const selectAllCities = (state: RootState) => state.city.cities

export const citySliceReducer = citySlice.reducer
