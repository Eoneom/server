import { getReport, listReports } from '#communication/report/slice/thunk'
import {
  selectReportCurrentPage,
  selectReportsPageSize,
  selectReportsTotal
} from '#communication/report/slice'
import { formatDate } from '#helpers/transform'
import { Button } from '#ui/button'
import { useAppDispatch, useAppSelector } from '#store/type'
import { ReportItem } from '#types'
import classNames from 'classnames'
import React from 'react'

interface Props {
  reports: ReportItem[]
}

export const ReportList: React.FC<Props> = ({ reports }) => {
  const dispatch = useAppDispatch()
  const currentPage = useAppSelector(selectReportCurrentPage)
  const total = useAppSelector(selectReportsTotal)
  const pageSize = useAppSelector(selectReportsPageSize)
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0
  const canPrev = currentPage > 1
  const canNext = totalPages > 0 && currentPage < totalPages

  return <>
    {
      totalPages > 1 && (
        <>
          <p>
            Page {currentPage}/{totalPages}
          </p>
          <div>
            <Button
              disabled={!canPrev}
              onClick={() => dispatch(listReports({ page: currentPage - 1 }))}
            >
              Précédente
            </Button>
            <Button
              disabled={!canNext}
              onClick={() => dispatch(listReports({ page: currentPage + 1 }))}
            >
              Suivante
            </Button>
          </div>
        </>
      )
    }
    <ul>
      {reports.map(report =>
        <li
          onClick={() => dispatch(getReport(report.id))}
          key={report.id}
          className={classNames({'unread': !report.was_read})}
        >
          {report.type} {formatDate(report.recorded_at)}
        </li>
      )}
    </ul>
  </>
}
