import React, { createContext, useContext, useState } from 'react'

interface LocationContextValue {
  cityId: string | null
  outpostId: string | null
  setCity: (id: string) => void
  setOutpost: (id: string) => void
  clearLocation: () => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cityId, setCityId] = useState<string | null>(null)
  const [outpostId, setOutpostId] = useState<string | null>(null)

  const setCity = (id: string) => {
    setCityId(id)
    setOutpostId(null)
  }

  const setOutpost = (id: string) => {
    setOutpostId(id)
    setCityId(null)
  }

  const clearLocation = () => {
    setCityId(null)
    setOutpostId(null)
  }

  return (
    <LocationContext.Provider value={{ cityId, outpostId, setCity, setOutpost, clearLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = (): LocationContextValue => {
  const ctx = useContext(LocationContext)
  if (!ctx) {
    throw new Error('useLocation must be used inside LocationProvider')
  }
  return ctx
}
