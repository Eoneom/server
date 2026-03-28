import React from 'react'

import { ListItem } from '#ui/list/item'

interface Props {
  name: string
  level: number
  active: boolean
  onSelect: () => void
}

export const ListItemLevel: React.FC<Props> = ({ level, ...props }) => {
  return <ListItem {...props}>
    <p>Niveau {level}</p>
  </ListItem>
}
