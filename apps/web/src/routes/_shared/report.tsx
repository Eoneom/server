import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { ReportPage } from '#communication/page'

const SharedReportRoute: React.FC = () => {
  return <ReportPage />
}

export const Route = createFileRoute('/_shared/report')({
  component: SharedReportRoute,
})
