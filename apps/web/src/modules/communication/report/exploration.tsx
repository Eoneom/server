import { Report } from '#types'
import { TroupTranslations } from '#troup/translations'
import React from 'react'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { formatCoordinates } from '#helpers/transform'

interface Props {
  report?: Report
}

export const ReportExploration: React.FC<Props> = ({ report }) => {
  if (!report) {
    return null
  }

  return <LayoutDetailsContent>
    <h1>Exploration</h1>
    <h3>Source: {formatCoordinates(report.origin)}</h3>
    <h3>Destination: {formatCoordinates(report.destination)}</h3>
    <h3>Troupes</h3>
    <ul>
      {
        report.troups.map(troup => <li key={troup.code}>
          {TroupTranslations[troup.code].name} {troup.count}
        </li>)
      }
    </ul>
  </LayoutDetailsContent>
}
