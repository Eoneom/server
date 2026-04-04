import React from 'react'
import { NavLink } from 'react-router-dom'

import { getActiveClassName } from '#helpers/classname'
import { getUrlPrefix } from '#helpers/url'
import { useLocation } from '#location/context'
import { useLogout } from '#auth/hooks'
import { useCountUnreadReports } from '#communication/report/hooks'

export const NavMenu: React.FC = () => {
  const { mutate: logout } = useLogout()
  const { cityId, outpostId } = useLocation()
  const { data: unreadCount } = useCountUnreadReports()

  const urlPrefix = getUrlPrefix({ cityId, outpostId })

  return (
    <nav id="menu">
      {cityId && (
        <section className="nav-menu-section">
          <h2>Ville</h2>
          <ul>
            <li>
              <NavLink className={getActiveClassName} to={`/city/${cityId}/building`}>
                Construction
              </NavLink>
            </li>
            <li>
              <NavLink className={getActiveClassName} to={`/city/${cityId}/technology`}>
                Recherche
              </NavLink>
            </li>
            <li>
              <NavLink className={getActiveClassName} to={`/city/${cityId}/troop`}>
                Recrutement
              </NavLink>
            </li>
          </ul>
        </section>
      )}

      <section className="nav-menu-section">
        <h2>Monde</h2>
        <ul>
          <li>
            <NavLink className={getActiveClassName} to={`${urlPrefix}/map`}>
              Carte
            </NavLink>
          </li>
          <li>
            <NavLink className={getActiveClassName} to={`${urlPrefix}/movement`}>
              Déplacement
            </NavLink>
          </li>
          <li className="nav-menu-placeholder">Alliance</li>
          <li className="nav-menu-placeholder">Empire</li>
        </ul>
      </section>

      <section className="nav-menu-section">
        <h2>Messages</h2>
        <ul>
          <li>
            <NavLink className={getActiveClassName} to={'report'}>
              Rapport ({unreadCount ?? 0})
            </NavLink>
          </li>
          <li className="nav-menu-placeholder">Messagerie</li>
        </ul>
      </section>

      <section className="nav-menu-section">
        <h2>Compte</h2>
        <ul>
          <li className="nav-menu-placeholder">Paramètres</li>
          <li>
            <NavLink
              to={'logout'}
              onClick={e => {
                e.preventDefault()
                logout()
              }}
            >
              Se déconnecter
            </NavLink>
          </li>
        </ul>
      </section>
    </nav>
  )
}
