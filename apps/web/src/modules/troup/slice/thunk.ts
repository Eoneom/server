import { selectToken } from '#auth/slice'
import { selectCityId } from '#city/slice'
import { refreshCity } from '#city/slice/thunk'
import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { resetOutpost, selectOutpostId } from '#outpost/slice'
import { listOutposts } from '#outpost/slice/thunk'
import { createAppAsyncThunk } from '#store/type'
import { setTroups } from '#troup/slice'
import { Coordinates, MovementAction, TroupCode } from '@kroust/swarm-client'

export const getTroup = createAppAsyncThunk('troup/get', async (id: string, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.troup.get(token, { troup_id: id })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  return res.data
})

export const listTroups = createAppAsyncThunk('troup/list', async (_, { dispatch, getState, rejectWithValue }) => {
  const state = getState()

  const token = selectToken(state)
  const cityId = selectCityId(state)
  const outpostId = selectOutpostId(state)

  if (!token) {
    throw rejectWithValue('no token or location')
  }

  if (cityId) {
    const res = await client.troup.listCity(token, { city_id: cityId })
    if (isError(res)) {
      throw rejectWithValue(res.error_code)
    }

    if (!res.data) {
      throw rejectWithValue('no data')
    }

    dispatch(setTroups(res.data.troups))
    return
  }

  if (outpostId) {
    const res = await client.troup.listOutpost(token, { outpost_id: outpostId })
    if (isError(res)) {
      throw rejectWithValue(res.error_code)
    }

    if (!res.data) {
      throw rejectWithValue('no data')
    }

    dispatch(setTroups(res.data.troups))
    return
  }

  throw rejectWithValue('no city id or outpost id')
})

export const recruitTroup = createAppAsyncThunk( 'troup/recruit', async ({ code, count }: { code: TroupCode, count: number}, { dispatch, getState, rejectWithValue }) => {
  const state = getState()
  const token = selectToken(state)
  const cityId = selectCityId(state)

  if (!cityId || !token) {
    throw rejectWithValue('no city id or token')
  }

  const res = await client.troup.recruit(token, {
    city_id: cityId,
    troup_code: code,
    count
  })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listTroups())
  dispatch(refreshCity())
})

export const progressRecruitTroup = createAppAsyncThunk('troup/progress', async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState()
  const token = selectToken(state)
  const cityId = selectCityId(state)

  if (!cityId || !token) {
    throw rejectWithValue('no city id or token')
  }

  const res = await client.troup.progressRecruit(token, { city_id: cityId })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listTroups())
})

export const cancelTroup = createAppAsyncThunk('troup/cancel', async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState()
  const token = selectToken(state)
  const cityId = selectCityId(state)
  if (!cityId || !token) {
    throw rejectWithValue('no city id or token')
  }

  const res = await client.troup.cancel(token, { city_id: cityId })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listTroups())
  dispatch(refreshCity())
})

export const createMovement = createAppAsyncThunk(
  'troup/movement/create',
  async ({
    action,
    origin,
    destination,
    troups
  }: {
    action: MovementAction
    origin: Coordinates
    destination: Coordinates
    troups: { code: TroupCode, count: number }[]
  }, { getState, dispatch, rejectWithValue }) => {
    const state = getState()
    const token = selectToken(state)
    if (!token) {
      throw rejectWithValue('no token')
    }

    const res = await client.troup.createMovement(token, { action, origin, destination, troups })
    if (isError(res)) {
      throw rejectWithValue(res.error_code)
    }

    dispatch(listMovements())

    if (res.data?.deleted_outpost_id) {
      await dispatch(listOutposts())

      const outpostId = selectOutpostId(state)
      if (outpostId === res.data.deleted_outpost_id) {
        dispatch(resetOutpost())
      }
    }

    dispatch(listTroups())
  })

export const listMovements = createAppAsyncThunk('troup/movement/list', async (_, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.troup.listMovement(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  return res.data.movements
})

export const getMovement = createAppAsyncThunk('troup/movement/get', async (id: string, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.troup.getMovement(token, { movement_id: id })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  return res.data
})

export const finishMovement = createAppAsyncThunk('troup/movement/finish', async (_, { dispatch, getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.troup.finishMovement(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  const isOutpostCreated = Boolean(res.data?.is_outpost_created)
  if (isOutpostCreated) {
    dispatch(listOutposts())
  }

  dispatch(listMovements())
})
