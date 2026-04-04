import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { CityPage } from '#city/page'

const CityRoute: React.FC = () => {
  const { cityId } = Route.useParams()
  return <CityPage cityId={cityId} />
}

export const Route = createFileRoute('/city/$cityId/')({
  component: CityRoute,
})
