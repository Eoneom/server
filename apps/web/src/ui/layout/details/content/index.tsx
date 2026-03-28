import React from 'react'

interface Props {
  children: React.ReactNode
}

export const LayoutDetailsContent: React.FC<Props> = ({ children }) => {
  return <article id="details-content">
    {children}
  </article>
}
