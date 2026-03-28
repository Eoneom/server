import React from 'react'
import classNames from 'classnames'

interface Props {
  active: boolean
  name: string
  onSelect: () => void
  children?: React.ReactNode
}

export const ListItem: React.FC<Props> = ({ active, name, onSelect, children }) => {
  const activeClassName = active ? 'active' : ''
  return <article className={classNames('item', activeClassName)} onClick={() => onSelect()}>
    <h3>{name}</h3>
    {children}
  </article>
}
