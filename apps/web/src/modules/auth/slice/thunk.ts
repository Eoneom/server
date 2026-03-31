import { resetToken, selectToken, setToken } from '#auth/slice'
import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { wsClient } from '#helpers/websocket'
import { registerCityWsListeners } from '#city/slice/ws-listener'
import { createAppAsyncThunk } from '#store/type'

export const retrieveStoredToken = createAppAsyncThunk('auth/retrieveStoredToken', async (_, { dispatch }) => {
  const storedToken = window.localStorage.getItem('token')
  if (!storedToken) {
    return
  }

  dispatch(setToken(storedToken))
  registerCityWsListeners()
  wsClient.connect(storedToken)
})

export const login = createAppAsyncThunk('auth/login', async (playerName: string, { dispatch, rejectWithValue }) => {
  let token
  try {
    token = await doLogin({ playerName })
  } catch (err) {
    await doSignup({ playerName, cityName: `${playerName}City` })
    token = await doLogin({ playerName })
  }

  if (!token) {
    throw rejectWithValue('error occured during login/signup')
  }

  window.localStorage.setItem('token', token)

  dispatch(setToken(token))
  registerCityWsListeners()
  wsClient.connect(token)
})

export const logout = createAppAsyncThunk('auth/logout', async (_, { dispatch, getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    return
  }

  const res = await client.player.logout(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  window.localStorage.removeItem('token')

  wsClient.disconnect()
  dispatch(resetToken())
})

const doLogin = async ({ playerName }: {  playerName: string}): Promise<string> => {
  const res = await client.player.login({ player_name: playerName})
  if (isError(res)) {
    throw new Error(res.error_code)
  }

  if (!res.data?.token) {
    throw new Error('token:not-in:response')
  }

  return res.data?.token
}

const doSignup = async ({ playerName, cityName }: {  playerName: string, cityName: string }): Promise<void> => {
  const res = await client.player.signup({ player_name: playerName, city_name: cityName })
  if (isError(res)) {
    throw new Error(res.error_code)
  }

  return
}

