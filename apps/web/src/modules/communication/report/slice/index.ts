import { countUnreadReports, getReport, listReports } from '#communication/report/slice/thunk'
import { RootState } from '#store/index'
import { Report, ReportItem } from '#types'
import { createSlice, isRejected } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface ReportState {
  report: Report | null
  reports: ReportItem[]
  unreadCount: number
}

const initialState: ReportState = {
  report: null,
  reports: [],
  unreadCount: 0
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getReport.fulfilled, (state, action) => {
        state.report = action.payload
      })
      .addCase(listReports.fulfilled, (state, action) => {
        state.reports = action.payload
      })
      .addCase(countUnreadReports.fulfilled, (state, action) => {
        state.unreadCount = action.payload
      })
      .addMatcher(isRejected, (_, action) => {
        toast.error(action.payload as string)
      })
  }
})

export const selectReports = (state: RootState) => state.report.reports

export const selectReport = (state: RootState) => state.report.report
export const selectUnreadReportCount = (state: RootState) => state.report.unreadCount

export const reportSliceReducer = reportSlice.reducer
