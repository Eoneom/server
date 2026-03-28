import classNames from 'classnames'
import React from 'react'

interface Props {
  children: React.ReactNode
  content: React.ReactNode
  position: 'top' | 'bottom' | 'right' | 'left'
}

export const Tooltip: React.FC<Props> = ({ children, content, position }) => {
  return <div className='tooltip'>
    {children}
    <span className={classNames('tooltip-text', position)}>{content}</span>
  </div>
}
