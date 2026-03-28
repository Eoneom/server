import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  to: string
  text: string
}

export const HeaderTitle: React.FC<Props> = ({ to, text }) => {
  return <h1><Link to={to}>{text}</Link></h1>
}
