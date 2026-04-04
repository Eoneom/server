import React from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SharedRoot } from '../../modules/shared/root'

const SharedLayout: React.FC = () => {
  return (
    <SharedRoot>
      <Outlet />
    </SharedRoot>
  )
}

export const Route = createFileRoute('/_shared')({
  component: SharedLayout,
})
