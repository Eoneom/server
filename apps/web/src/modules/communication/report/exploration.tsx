import { Report } from '#types'
import { TroopTranslations } from '#troop/translations'
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
        report.troops.map(troop => <li key={troop.code}>
          {TroopTranslations[troop.code].name} {troop.count}
        </li>)
      }
    </ul>
  </LayoutDetailsContent>
}
