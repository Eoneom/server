import React from 'react'
import { useParams } from 'react-router-dom'

import { LayoutPage } from '#ui/layout/page'
import { MovementList } from '#movement/list'
import { MovementDetails } from '#movement/details'
import { MovementCreate } from '#movement/create'
import { useGetMovement } from '#troop/hooks'

export const MovementPage: React.FC = () => {
  const { movementId } = useParams()
  const { data: movement } = useGetMovement(movementId)

  return (
    <LayoutPage details={movement && <MovementDetails movement={movement} />}>
      <div className="movement-page">
        <MovementCreate />
        <MovementList />
      </div>
    </LayoutPage>
  )
}
