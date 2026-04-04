import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { OutpostRoot } from '#outpost/root'

const OutpostRoute: React.FC = () => {
  const { outpostId } = Route.useParams()
  return <OutpostRoot outpostId={outpostId} />
}

export const Route = createFileRoute('/outpost/$outpostId')({
  component: OutpostRoute,
})
