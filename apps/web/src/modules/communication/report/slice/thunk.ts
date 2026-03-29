import { selectToken } from '#auth/slice'
import { client } from '#helpers/api'
import { isError } from '#helpers/assertion'
import { createAppAsyncThunk } from '#store/type'

export const listReports = createAppAsyncThunk(
  'report/list',
  async (arg: { page?: number } | undefined, { getState, rejectWithValue }) => {
    const token = selectToken(getState())
    if (!token) {
      throw rejectWithValue('empty token')
    }

    const state = getState() as { report: { currentPage: number } }
    const page = arg?.page ?? state.report.currentPage

    const res = await client.communication.listReport(token, { page })
    if (isError(res)) {
      throw rejectWithValue(res.error_code)
    }

    if (!res.data) {
      throw rejectWithValue('no data')
    }

    return {
      reports: res.data.reports,
      total: res.data.total,
      page_size: res.data.page_size,
      page
    }
  }
)

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
