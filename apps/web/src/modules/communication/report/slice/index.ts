import { countUnreadReports, getReport, listReports } from '#communication/report/slice/thunk'
import { RootState } from '#store/index'
import { Report, ReportItem } from '#types'
import { createSlice, isRejected } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface ReportState {
  report: Report | null
  reports: ReportItem[]
  unreadCount: number
  reportsTotal: number
  reportsPageSize: number
  currentPage: number
}

const initialState: ReportState = {
  report: null,
  reports: [],
  unreadCount: 0,
  reportsTotal: 0,
  reportsPageSize: 0,
  currentPage: 1
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
        state.reports = action.payload.reports
        state.reportsTotal = action.payload.total
        state.reportsPageSize = action.payload.page_size
        state.currentPage = action.payload.page
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
export const selectReportsTotal = (state: RootState) => state.report.reportsTotal
export const selectReportsPageSize = (state: RootState) => state.report.reportsPageSize
export const selectReportCurrentPage = (state: RootState) => state.report.currentPage

export const reportSliceReducer = reportSlice.reducer
