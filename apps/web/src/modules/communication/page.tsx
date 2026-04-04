import { LayoutPage } from '#ui/layout/page'
import React, { useState } from 'react'
import { ReportList } from '#communication/report/list'
import { ReportExploration } from '#communication/report/exploration'
import { useListReports, useGetReport } from '#communication/report/hooks'

export const ReportPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  const { data: reportsData } = useListReports(currentPage)
  const { data: report } = useGetReport(selectedReportId)

  const reports = reportsData?.reports ?? []

  return <LayoutPage details={report && <ReportExploration report={report}/>}>
    <ReportList
      reports={reports}
      currentPage={currentPage}
      total={reportsData?.total ?? 0}
      pageSize={reportsData?.page_size ?? 0}
      onPageChange={setCurrentPage}
      onReportSelect={setSelectedReportId}
    />
  </LayoutPage>
}
