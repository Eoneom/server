import React from 'react'

import { MovementListItem } from '#movement/list/item'
import { useListMovements } from '#troop/hooks'

export const MovementList: React.FC = () => {
  const { data: movements = [] } = useListMovements()

  return (
    <section
      className="movement-section movement-section--active"
      aria-labelledby="movements-active-heading"
    >
      <h2 id="movements-active-heading" className="movement-section__title">
        Déplacements en cours
      </h2>
      <p className="movement-section__lede">
        Temps restant jusqu&apos;à l&apos;arrivée sur la case indiquée.
      </p>
      {movements.length ? (
        <ul className="app-list app-list--link movement-active-list">
          {movements.map(movement => (
            <MovementListItem key={movement.id} movement={movement} />
          ))}
        </ul>
      ) : (
        <p className="movement-empty">Aucun déplacement en cours.</p>
      )}
    </section>
  )
}
