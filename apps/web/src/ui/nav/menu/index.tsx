import React from 'react'
import { Link, useLocation as useRouterLocation } from '@tanstack/react-router'

import { getActiveClassName } from '#helpers/classname'
import { useLocation } from '#location/context'
import { useLogout } from '#auth/hooks'
import { useCountUnreadReports } from '#communication/report/hooks'

export const NavMenu: React.FC = () => {
  const { mutate: logout } = useLogout()
  const { cityId, outpostId } = useLocation()
  const { pathname } = useRouterLocation()
  const { data: unreadCount } = useCountUnreadReports()
  const RouterLink = Link as React.ComponentType<{
    to: string
    params?: Record<string, string>
    className?: string
    children: React.ReactNode
  }>
  const getLinkClassName = (href: string) =>
    getActiveClassName({ isActive: pathname === href || pathname.startsWith(`${href}/`) })

  return (
    <nav id="menu">
      {cityId && (
        <section className="nav-menu-section">
          <h2>Ville</h2>
          <ul>
            <li>
              <RouterLink
                to="/city/$cityId/building"
                params={{ cityId }}
                className={getLinkClassName(`/city/${cityId}/building`)}
              >
                Construction
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/city/$cityId/technology"
                params={{ cityId }}
                className={getLinkClassName(`/city/${cityId}/technology`)}
              >
                Recherche
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/city/$cityId/troop"
                params={{ cityId }}
                className={getLinkClassName(`/city/${cityId}/troop`)}
              >
                Recrutement
              </RouterLink>
            </li>
          </ul>
        </section>
      )}

      <section className="nav-menu-section">
        <h2>Monde</h2>
        <ul>
          <li>
            {cityId ? (
              <RouterLink
                to="/city/$cityId/map"
                params={{ cityId }}
                className={getLinkClassName(`/city/${cityId}/map`)}
              >
                Carte
              </RouterLink>
            ) : outpostId ? (
              <RouterLink
                to="/outpost/$outpostId/map"
                params={{ outpostId }}
                className={getLinkClassName(`/outpost/${outpostId}/map`)}
              >
                Carte
              </RouterLink>
            ) : null}
          </li>
          <li>
            {cityId ? (
              <RouterLink
                to="/city/$cityId/movement"
                params={{ cityId }}
                className={getLinkClassName(`/city/${cityId}/movement`)}
              >
                Déplacement
              </RouterLink>
            ) : outpostId ? (
              <RouterLink
                to="/outpost/$outpostId/movement"
                params={{ outpostId }}
                className={getLinkClassName(`/outpost/${outpostId}/movement`)}
              >
                Déplacement
              </RouterLink>
            ) : null}
          </li>
          <li className="nav-menu-placeholder">Alliance</li>
          <li className="nav-menu-placeholder">Empire</li>
        </ul>
      </section>

      <section className="nav-menu-section">
        <h2>Messages</h2>
        <ul>
          <li>
            <RouterLink
              to="/report"
              className={getLinkClassName('/report')}
            >
              Rapport ({unreadCount ?? 0})
            </RouterLink>
          </li>
          <li className="nav-menu-placeholder">Messagerie</li>
        </ul>
      </section>

      <section className="nav-menu-section">
        <h2>Compte</h2>
        <ul>
          <li className="nav-menu-placeholder">Paramètres</li>
          <li>
            <button
              type="button"
              className="nav-menu-logout"
              onClick={e => {
                e.preventDefault()
                logout()
              }}
            >
              Se déconnecter
            </button>
          </li>
        </ul>
      </section>
    </nav>
  )
}
