import React from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'

import { getActiveClassName } from '#helpers/classname'

interface Props {
  to: string
  text: string
  /** e.g. monospace for coordinate labels */
  linkClassName?: string
}

export const NavLocationItem: React.FC<Props> = ({ to, text, linkClassName }) => {
  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          classNames(getActiveClassName({ isActive }), 'nav-location-link', linkClassName)
        }
        to={to}
      >
        {text}
      </NavLink>
    </li>
  )
}
