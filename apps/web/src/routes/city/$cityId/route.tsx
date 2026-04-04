import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { CityRoot } from '#city/root'

const CityRoute: React.FC = () => {
  const { cityId } = Route.useParams()
  return <CityRoot cityId={cityId} />
}

export const Route = createFileRoute('/city/$cityId')({
  component: CityRoute,
})
