import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { selectCityId } from '#city/slice'
import { createAppAsyncThunk } from '#store/type'
import { selectToken } from '#auth/slice'
import { listOutposts } from '#outpost/slice/thunk'
import { resetOutpost, selectOutpostId } from '#outpost/slice'

export const gatherCity = createAppAsyncThunk('city/gather', async (_, { getState, dispatch, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const cityId = selectCityId(getState())
  if (!cityId) {
    return
  }

  await client.city.gather(token, { city_id: cityId })

  dispatch(getCity(cityId))
})

export const refreshCity = createAppAsyncThunk('city/refresh', async (_, { getState, dispatch, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const cityId = selectCityId(getState())
  if (!cityId) {
    return
  }

  dispatch(getCity(cityId))
})

export const getCity = createAppAsyncThunk('city/get', async (cityId: string, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const res = await client.city.get(token, { city_id: cityId })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('Ville non trouvée')
  }

  return res.data
})

export const listCities = createAppAsyncThunk('city/list', async (_, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const res = await client.city.list(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('data not found')
  }

  const { data } = res
  if (!data.cities.length) {
    throw rejectWithValue('there is no city here 😬')
  }

  return res.data?.cities ?? null
})

export const settleCity = createAppAsyncThunk('city/settle', async (name: string, { getState, dispatch, rejectWithValue }) => {
  const state = getState()
  const outpostId = selectOutpostId(state)
  if (!outpostId) {
    return
  }

  const token = selectToken(state)
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const res = await client.city.settle(token, { city_name: name, outpost_id: outpostId })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('data not found')
  }

  const newCityId = res.data.city_id
  dispatch(listCities())
  dispatch(listOutposts())
  dispatch(resetOutpost())
  dispatch(getCity(newCityId))
})
