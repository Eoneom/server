import { RootState } from '#store/index'
import { getTechnology, listTechnologies } from '#technology/slice/thunk'
import { Technology, TechnologyItem } from '#types'
import { createSlice, isRejected } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface TechnologyState {
  technology: Technology | null,
  technologies: TechnologyItem[]
}

const initialState: TechnologyState = {
  technology: null,
  technologies: []
}

export const technologySlice = createSlice({
  name: 'technology',
  initialState,
  reducers: {},
  extraReducers (builder) {
    builder
      .addCase(listTechnologies.fulfilled, (state, action) => {
        state.technologies = action.payload ?? []
      })
      .addCase(getTechnology.fulfilled, (state, action) => {
        state.technology = action.payload
      })
      .addMatcher(isRejected, (_, action) => {
        toast.error(action.payload as string)
      })
  }
})

export const selectTechnologies = (state: RootState) => state.technology.technologies
export const selectTechnologyInProgress = (state: RootState) => state.technology.technologies.find(technology => technology.research_at)

export const selectTechnology = (state: RootState) => state.technology.technology

export const technologySliceReducer = technologySlice.reducer
