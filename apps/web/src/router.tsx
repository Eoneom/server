import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import App from './App'
import { BuildingPage } from '#building/page'
import { TechnologyPage } from '#technology/page'
import { MapPage } from '#map/page'
import { CityPage } from '#city/page'
import { TroupPage } from '#troup/page'
import { MovementPage } from '#movement/page'
import { ReportPage } from '#communication/page'
import { CityRoot } from '#city/root'
import { OutpostRoot } from '#outpost/root'
import { OutpostPage } from '#outpost/page'
import { SharedRoot } from './modules/shared/root'

const map = {
  path: 'map',
  element: <MapPage />
}

const movement = {
  path: 'movement',
  element: <MovementPage />,
  children: [
    {
      path: ':movementId',
      element: <MovementPage />
    }
  ]
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <SharedRoot />,
        children: [
          {
            path: '',
            element: <section id="content"><h1>Bienvenue</h1></section>
          },
          {
            path: 'report',
            element: <ReportPage />
          }
        ]
      },
      {
        path: 'city/:cityId',
        element: <CityRoot />,
        children: [
          {
            path: '',
            element: <CityPage />
          },
          {
            path: 'building',
            element: <BuildingPage />
          },
          {
            path: 'technology',
            element: <TechnologyPage />
          },
          {
            path: 'troup',
            element: <TroupPage />
          },
          map,
          movement
        ]
      },
      {
        path: 'outpost/:outpostId',
        element: <OutpostRoot />,
        children: [
          {
            path: '',
            element: <OutpostPage />,
          },
          {
            path: 'map',
            element: <MapPage />
          },
          map,
          movement
        ]
      }
    ]
  },
])
