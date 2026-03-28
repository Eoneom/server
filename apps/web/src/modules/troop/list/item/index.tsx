import React from 'react'
import { TroopItem } from '#types'
import { TroopTranslations } from '#troop/translations'
import { ListItemCount } from '#ui/list/item/count'
import { useAppDispatch } from '#store/type'
import { getTroop } from '#troop/slice/thunk'

interface Props {
  active: boolean
  troop: TroopItem
}

export const TroopListItem: React.FC<Props> = ({ active, troop }) => {
  const dispatch = useAppDispatch()
  return <ListItemCount
    active={active}
    name={TroopTranslations[troop.code].name}
    count={troop.count}
    onSelect={() => dispatch(getTroop(troop.id))}
  />
}
