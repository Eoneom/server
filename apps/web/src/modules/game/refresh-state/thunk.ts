import { client } from '#helpers/api'
import { selectCityId } from '#city/slice'
import { createAppAsyncThunk } from '#store/type'
import { selectToken } from '#auth/slice'

export const refreshGameState = createAppAsyncThunk('game/refresh-state', async (_, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const cityId = selectCityId(getState())
  if (!cityId) {
    return
  }

  await client.game.refreshState(token, { city_id: cityId })
})
