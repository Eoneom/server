import React from 'react'

interface Props {
  children: React.ReactNode
  details?: React.ReactNode
}

export const LayoutPage: React.FC<Props> = ({ details, children }) => {
  return <>
    <section id="content" className={details ? 'details-enabled': ''}>
      {children}
    </section>
    {
      Boolean(details) && <section id="details">
        {details}
      </section>
    }
  </>
}
