import React from 'react'
import { TroupItem } from '#types'
import { TroupTranslations } from '#troup/translations'
import { ListItemCount } from '#ui/list/item/count'
import { useAppDispatch } from '#store/type'
import { getTroup } from '#troup/slice/thunk'

interface Props {
  active: boolean
  troup: TroupItem
}

export const TroupListItem: React.FC<Props> = ({ active, troup }) => {
  const dispatch = useAppDispatch()
  return <ListItemCount
    active={active}
    name={TroupTranslations[troup.code].name}
    count={troup.count}
    onSelect={() => dispatch(getTroup(troup.id))}
  />
}
