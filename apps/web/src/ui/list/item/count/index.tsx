import React from 'react'

import { ListItem } from '#ui/list/item'

interface Props {
  active: boolean
  name: string
  count: number
  onSelect: () => void
}

export const ListItemCount: React.FC<Props> = ({ count, ...props }) => {
  return <ListItem {...props}>
    <p>Nombre {count}</p>
  </ListItem>
}
