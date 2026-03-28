import React from 'react'

interface Props {
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}

export const Button: React.FC<Props> = ({ onClick, disabled, children }) => {
  return <button
    disabled={disabled}
    onClick={() => onClick && onClick()}
  >
    {children}
  </button>
}
