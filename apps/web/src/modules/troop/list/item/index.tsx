import React from 'react'

import { TroopItem } from '#types'
import { troopImageSrc } from '#troop/image'
import { TroopTranslations } from '#troop/translations'
import { ListItemCount } from '#ui/list/item/count'

interface Props {
  active: boolean
  troop: TroopItem
  onSelect: (id: string) => void
}

export const TroopListItem: React.FC<Props> = ({ active, troop, onSelect }) => {
  return <ListItemCount
    active={active}
    name={TroopTranslations[troop.code].name}
    count={troop.count}
    image={{
      src: troopImageSrc(troop.code),
      alt: '',
    }}
    onSelect={() => onSelect(troop.id)}
  />
}
