import React, { useMemo } from 'react'
import { TroupListItem } from '#troup/list/item'
import { TroupListInProgress } from '#troup/list/in-progress'
import { List } from '#ui/list'
import { useAppSelector } from '#store/type'
import { selectTroup, selectTroups } from '#troup/slice'

export const TroupList: React.FC = () => {
  const troups = useAppSelector(selectTroups)
  const selectedTroup = useAppSelector(selectTroup)

  const items = useMemo(() => {
    return troups.map(troup => <TroupListItem
      active={selectedTroup?.code === troup.code}
      key={troup.id}
      troup={troup}
    />)
  }, [selectedTroup?.code, troups])

  return <List
    inProgress={<TroupListInProgress />}
    items={items}
  />
}
