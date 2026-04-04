import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { MovementPage } from '#movement/page'

const CityMovementDetailsRoute: React.FC = () => {
  const { cityId, movementId } = Route.useParams()
  return <MovementPage cityId={cityId} movementId={movementId} />
}

export const Route = createFileRoute('/city/$cityId/movement/$movementId')({
  component: CityMovementDetailsRoute,
})
