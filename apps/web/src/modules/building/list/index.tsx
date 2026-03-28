import React, { useMemo } from 'react'

import { BuildingListItem } from '#building/list/item'
import { BuildingTranslations } from '#building/translations'
import { formatTime } from '#helpers/transform'
import { Button } from '#ui/button'
import { List } from '#ui/list'
import { useTimer } from '#hook/timer'
import { useAppDispatch, useAppSelector } from '#store/type'
import { cancelBuildingUpgrade, finishBuildingUpgrade } from '#building/slice/thunk'
import { selectBuilding, selectBuildingInProgress, selectBuildings } from '#building/slice'

export const BuildingList: React.FC = () => {
  const dispatch = useAppDispatch()
  const inProgress = useAppSelector(selectBuildingInProgress)
  const building = useAppSelector(selectBuilding)
  const buildings = useAppSelector(selectBuildings)

  const { remainingTime, reset } = useTimer({
    onDone: () => dispatch(finishBuildingUpgrade()),
    doneAt: inProgress?.upgrade_at
  })

  const handleCancel = () => {
    dispatch(cancelBuildingUpgrade())
    reset()
  }

  const inProgressComponent = inProgress && <>
    <p>En cours: {BuildingTranslations[inProgress.code].name} <strong>{formatTime(remainingTime)}</strong></p>
    <Button onClick={handleCancel}>Annuler</Button>
  </>

  const items = useMemo(() => buildings.map(buildingItem =>
    <BuildingListItem
      active={building?.code === buildingItem.code}
      key={buildingItem.id}
      buildingItem={buildingItem}
    />
  ), [building?.code, buildings])

  return <List
    inProgress={inProgressComponent}
    items={items}
  />
}
