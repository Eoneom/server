import { selectToken } from '#auth/slice'
import { selectCityId } from '#city/slice'
import { refreshCity } from '#city/slice/thunk'
import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { resetOutpost, selectOutpostId } from '#outpost/slice'
import { listOutposts } from '#outpost/slice/thunk'
import { createAppAsyncThunk } from '#store/type'
import { setTroops } from '#troop/slice'
import { Coordinates, MovementAction, TroopCode } from '@eoneom/api-client'

export const getTroop = createAppAsyncThunk('troop/get', async (id: string, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.troop.get(token, { troop_id: id })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  return res.data
})

export const listTroops = createAppAsyncThunk('troop/list', async (_, { dispatch, getState, rejectWithValue }) => {
  const state = getState()

  const token = selectToken(state)
  const cityId = selectCityId(state)
  const outpostId = selectOutpostId(state)

  if (!token) {
    throw rejectWithValue('no token or location')
  }

  if (cityId) {
    const res = await client.troop.listCity(token, { city_id: cityId })
    if (isError(res)) {
      throw rejectWithValue(res.error_code)
    }

    if (!res.data) {
      throw rejectWithValue('no data')
    }

    dispatch(setTroops(res.data.troops))
    return
  }

  if (outpostId) {
    const res = await client.troop.listOutpost(token, { outpost_id: outpostId })
    if (isError(res)) {
      throw rejectWithValue(res.error_code)
    }

    if (!res.data) {
      throw rejectWithValue('no data')
    }

    dispatch(setTroops(res.data.troops))
    return
  }

  throw rejectWithValue('no city id or outpost id')
})

export const recruitTroop = createAppAsyncThunk( 'troop/recruit', async ({ code, count }: { code: TroopCode, count: number}, { dispatch, getState, rejectWithValue }) => {
  const state = getState()
  const token = selectToken(state)
  const cityId = selectCityId(state)

  if (!cityId || !token) {
    throw rejectWithValue('no city id or token')
  }

  const res = await client.troop.recruit(token, {
    city_id: cityId,
    troop_code: code,
    count
  })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listTroops())
  dispatch(refreshCity())
})

export const progressRecruitTroop = createAppAsyncThunk('troop/progress', async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState()
  const token = selectToken(state)
  const cityId = selectCityId(state)

  if (!cityId || !token) {
    throw rejectWithValue('no city id or token')
  }

  const res = await client.troop.progressRecruit(token, { city_id: cityId })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listTroops())
})

export const cancelTroop = createAppAsyncThunk('troop/cancel', async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState()
  const token = selectToken(state)
  const cityId = selectCityId(state)
  if (!cityId || !token) {
    throw rejectWithValue('no city id or token')
  }

  const res = await client.troop.cancel(token, { city_id: cityId })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listTroops())
  dispatch(refreshCity())
})

export const createMovement = createAppAsyncThunk(
  'troop/movement/create',
  async ({
    action,
    origin,
    destination,
    troops
  }: {
    action: MovementAction
    origin: Coordinates
    destination: Coordinates
    troops: { code: TroopCode, count: number }[]
  }, { getState, dispatch, rejectWithValue }) => {
    const state = getState()
    const token = selectToken(state)
    if (!token) {
      throw rejectWithValue('no token')
    }

    const res = await client.troop.createMovement(token, { action, origin, destination, troops })
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

    dispatch(listTroops())
  })

export const listMovements = createAppAsyncThunk('troop/movement/list', async (_, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.troop.listMovement(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  return res.data.movements
})

export const getMovement = createAppAsyncThunk('troop/movement/get', async (id: string, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.troop.getMovement(token, { movement_id: id })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  return res.data
})

export const finishMovement = createAppAsyncThunk('troop/movement/finish', async (_, { dispatch, getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.troop.finishMovement(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  const isOutpostCreated = Boolean(res.data?.is_outpost_created)
  if (isOutpostCreated) {
    dispatch(listOutposts())
  }

  dispatch(listMovements())
})
