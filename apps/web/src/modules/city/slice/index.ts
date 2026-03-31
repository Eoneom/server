import { City, CityItem } from '#types'
import { createSlice, isRejected } from '@reduxjs/toolkit'
import { RootState } from '#store/index'
import { getCity, listCities } from '#city/slice/thunk'
import { toast } from 'react-toastify'

interface CityState {
  city: City | null,
  cities: CityItem[]
  cities_count_limit: number
}

const initialState: CityState = {
  city: null,
  cities: [],
  cities_count_limit: 0,
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
        if (!action.payload) return
        state.cities = action.payload.cities
        state.cities_count_limit = action.payload.count_limit
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
export const selectCityCountLimit = (state: RootState) => state.city.cities_count_limit

export const citySliceReducer = citySlice.reducer
