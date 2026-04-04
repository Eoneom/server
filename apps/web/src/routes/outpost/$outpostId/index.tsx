import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { OutpostPage } from '#outpost/page'

const OutpostRoute: React.FC = () => {
  const { outpostId } = Route.useParams()
  return <OutpostPage outpostId={outpostId} />
}

export const Route = createFileRoute('/outpost/$outpostId/')({
  component: OutpostRoute,
})
