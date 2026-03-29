import { getReport, listReports } from '#communication/report/slice/thunk'
import {
  selectReportCurrentPage,
  selectReportsPageSize,
  selectReportsTotal
} from '#communication/report/slice'
import { formatCoordinates, formatDate } from '#helpers/transform'
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

  return (
    <div className="report-list">
      {totalPages > 1 && (
        <div className="report-list__pagination">
          <p className="report-list__page-label">
            Page {currentPage}/{totalPages}
          </p>
          <div className="report-list__pagination-actions">
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
        </div>
      )}
      <ul className="report-list__items">
        {reports.map(report => (
          <li
            key={report.id}
            className={classNames('report-list__item', {
              'report-list__item--unread': !report.was_read
            })}
            onClick={() => dispatch(getReport(report.id))}
          >
            <div className="report-list__meta">
              <span className="report-list__type">{report.type}</span>
              <time dateTime={new Date(report.recorded_at).toISOString()}>
                {formatDate(report.recorded_at)}
              </time>
            </div>
            <div className="report-list__route">
              <span className="report-list__coords" title="Origine">
                {formatCoordinates(report.origin)}
              </span>
              <span className="report-list__arrow" aria-hidden>
                →
              </span>
              <span className="report-list__coords" title="Destination">
                {formatCoordinates(report.destination)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
