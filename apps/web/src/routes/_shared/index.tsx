import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

const WelcomePage: React.FC = () => {
  return <section id="content"><h1>Bienvenue</h1></section>
}

export const Route = createFileRoute('/_shared/')({
  component: WelcomePage,
})
