import { getReport } from '#communication/report/slice/thunk'
import { formatDate } from '#helpers/transform'
import { useAppDispatch } from '#store/type'
import { ReportItem } from '#types'
import classNames from 'classnames'
import React from 'react'

interface Props {
  reports: ReportItem[]
}

export const ReportList: React.FC<Props> = ({ reports }) => {
  const dispatch = useAppDispatch()

  return <ul>
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
}
