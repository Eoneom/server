import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { MovementPage } from '#movement/page'

const CityMovementRoute: React.FC = () => {
  const { cityId } = Route.useParams()
  return <MovementPage cityId={cityId} />
}

export const Route = createFileRoute('/city/$cityId/movement')({
  component: CityMovementRoute,
})
