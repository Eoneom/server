import { createRootRouteWithContext } from '@tanstack/react-router'

import App from '../App'

export const Route = createRootRouteWithContext()({
  component: App,
})
