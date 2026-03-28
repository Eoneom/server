import { LayoutPage } from '#ui/layout/page'
import React, { useEffect } from 'react'
import { ReportList } from '#communication/report/list'
import { ReportExploration } from '#communication/report/exploration'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectToken } from '#auth/slice'
import { listReports } from '#communication/report/slice/thunk'
import { selectReport, selectReports } from '#communication/report/slice'

export const ReportPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const reports = useAppSelector(selectReports)
  const report = useAppSelector(selectReport)
  const token = useAppSelector(selectToken)

  useEffect(() => {
    if (!token) {
      return
    }

    dispatch(listReports())
  }, [token])

  return <LayoutPage details={report && <ReportExploration report={report}/>}>
    <ReportList reports={reports} />
  </LayoutPage>
}
