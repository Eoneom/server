import React from 'react'

interface Props {
  max: number
  onChange: (value: number) => void
}

export const MovementCreateTroopsInput: React.FC<Props> = ({ max, onChange }) => {
  return <input
    type="number"
    max={max}
    min={0}
    onChange={event => onChange(Number.parseInt(event.target.value))}
  />
}
