import React from 'react'
import { NavLink } from 'react-router-dom'

import { getActiveClassName } from '#helpers/classname'
import { getUrlPrefix } from '#helpers/url'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectCityId } from '#city/slice'
import { logout } from '#auth/slice/thunk'
import { selectUnreadReportCount } from '#communication/report/slice'
import { selectOutpostId } from '#outpost/slice'

export const NavMenu: React.FC = () => {
  const dispatch = useAppDispatch()

  const unreadCount = useAppSelector(selectUnreadReportCount)
  const cityId = useAppSelector(selectCityId)
  const outpostId = useAppSelector(selectOutpostId)

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
              Rapport ({unreadCount})
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
                dispatch(logout())
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
