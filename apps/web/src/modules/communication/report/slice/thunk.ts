import { selectToken } from '#auth/slice'
import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { createAppAsyncThunk } from '#store/type'

export const listReports = createAppAsyncThunk('report/list', async (_, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const res = await client.communication.listReport(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  return res.data.reports
})

export const getReport = createAppAsyncThunk('report/get', async (reportId: string, { getState, dispatch, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const res = await client.communication.getReport(token, { report_id: reportId})
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  if (!res.data.was_read) {
    dispatch(markReportAsRead(reportId))
  }

  return res.data
})

export const markReportAsRead = createAppAsyncThunk('report/mark-read', async (reportId: string, { getState, dispatch, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const res = await client.communication.markReport(token, { report_id: reportId, was_read: true })
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  dispatch(listReports())
  dispatch(countUnreadReports())
})

export const countUnreadReports = createAppAsyncThunk('report/count-unread', async (_, { getState, rejectWithValue }) => {
  const token = selectToken(getState())
  if (!token) {
    throw rejectWithValue('empty token')
  }

  const res = await client.communication.countUnread(token)
  if (isError(res)) {
    throw rejectWithValue(res.error_code)
  }

  if (!res.data) {
    throw rejectWithValue('no data')
  }

  return res.data?.count
})
