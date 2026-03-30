import React from 'react'
import classNames from 'classnames'

interface Props {
  active: boolean
  name: string
  onSelect: () => void
  children?: React.ReactNode
  image?: {
    src: string
    alt: string
  }
}

export const ListItem: React.FC<Props> = ({
  active,
  name,
  onSelect,
  children,
  image,
}) => {
  const activeClassName = active ? 'active' : ''
  return <article className={classNames('item', activeClassName)} onClick={() => onSelect()}>
    {
      image
        ? <div className="item__media">
          <img src={image.src} alt={image.alt} className="item__thumb" loading="lazy" decoding="async" />
        </div>
        : null
    }
    <h3>{name}</h3>
    {children}
  </article>
}
