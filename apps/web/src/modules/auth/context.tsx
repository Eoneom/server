import React, { createContext, useContext, useState } from 'react'

interface AuthContextValue {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return window.localStorage.getItem('token')
  })

  const setToken = (newToken: string) => {
    window.localStorage.setItem('token', newToken)
    setTokenState(newToken)
  }

  const clearToken = () => {
    window.localStorage.removeItem('token')
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
