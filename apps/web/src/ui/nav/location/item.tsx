import React from 'react'
import { NavLink } from 'react-router-dom'

import { getActiveClassName } from '#helpers/classname'

interface Props {
  to: string
  text: string
}

export const NavLocationItem: React.FC<Props> = ({ to, text }) => {
  return <li>
    <NavLink className={getActiveClassName} to={to}>
      { text }
    </NavLink>
  </li>
}
