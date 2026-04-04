import React from 'react'
import classNames from 'classnames'
import { Link, useLocation } from '@tanstack/react-router'

import { getActiveClassName } from '#helpers/classname'
type Props = {
  text: string
  /** e.g. monospace for coordinate labels */
  linkClassName?: string
} & (
  | { kind: 'city'; cityId: string }
  | { kind: 'outpost'; outpostId: string }
)

export const NavLocationItem: React.FC<Props> = (props) => {
  const { text, linkClassName } = props
  const { pathname } = useLocation()
  const href =
    props.kind === 'city'
      ? `/city/${props.cityId}`
      : `/outpost/${props.outpostId}`
  const className = classNames(
    getActiveClassName({ isActive: pathname === href || pathname.startsWith(`${href}/`) }),
    'nav-location-link',
    linkClassName
  )

  const RouterLink = Link as React.ComponentType<{
    to: string
    params?: Record<string, string>
    className?: string
    children: React.ReactNode
  }>

  return (
    <li>
      {props.kind === 'city' ? (
        <RouterLink to="/city/$cityId" params={{ cityId: props.cityId }} className={className}>
          {text}
        </RouterLink>
      ) : (
        <RouterLink to="/outpost/$outpostId" params={{ outpostId: props.outpostId }} className={className}>
          {text}
        </RouterLink>
      )}
    </li>
  )
}
