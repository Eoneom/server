import { selectToken } from '#auth/slice'
import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { createAppAsyncThunk } from '#store/type'

export const getOutpost = createAppAsyncThunk('outpost/get', async (outpostId: string, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.outpost.get(token, { outpost_id: outpostId })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('data not found')
  }

  return res.data
})

export const listOutposts = createAppAsyncThunk('outpost/list', async (_, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('no token')
  }

  const res = await client.outpost.list(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('data not found')
  }

  return res.data.outposts
})
