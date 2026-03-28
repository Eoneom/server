import { configureStore } from '@reduxjs/toolkit'

import { authSliceReducer } from '#auth/slice'
import { buildingSliceReducer } from '#building/slice'
import { citySliceReducer } from '#city/slice'
import { reportSliceReducer } from '#communication/report/slice'
import { outpostSliceReducer } from '#outpost/slice'
import { technologySliceReducer } from '#technology/slice'
import { troupSliceReducer } from '#troup/slice'

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    building: buildingSliceReducer,
    city: citySliceReducer,
    outpost: outpostSliceReducer,
    report: reportSliceReducer,
    technology: technologySliceReducer,
    troup: troupSliceReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
