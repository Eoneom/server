import { selectToken } from '#auth/slice'
import { selectCityId } from '#city/slice'
import { refreshCity } from '#city/slice/thunk'
import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { createAppAsyncThunk } from '#store/type'
import { TechnologyCode } from '@kroust/swarm-client'

export const getTechnology = createAppAsyncThunk('technology/get', async (code: TechnologyCode, { getState, rejectWithValue }) => {
  const state = getState()
  const token = selectToken(state)
  const cityId = selectCityId(state)
  if (!cityId || !token) {
    throw rejectWithValue('no cityId or token')
  }

  const res = await client.technology.get(token, { city_id: cityId, technology_code: code })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  return res.data
})

export const listTechnologies = createAppAsyncThunk('technology/list', async (_, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    return
  }

  const res = await client.technology.list(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  return res.data?.technologies ?? null
})

export const cancelTechnology = createAppAsyncThunk('technology/cancel', async (_, { getState, dispatch, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    return
  }

  const res = await client.technology.cancel(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listTechnologies())
})

export const researchTechnology = createAppAsyncThunk('technology/research', async (code: TechnologyCode, { getState, dispatch, rejectWithValue }) => {
  const state = getState()
  const token = selectToken(state)
  const cityId = selectCityId(state)
  if (!cityId || !token) {
    return
  }

  const res = await client.technology.research(token, {
    city_id: cityId,
    technology_code: code
  })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listTechnologies())
  dispatch(refreshCity())
})

export const finishResearch = createAppAsyncThunk('technology/finish', async (_, { getState, dispatch, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    return
  }

  const res = await client.technology.finishResearch(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listTechnologies())
})
