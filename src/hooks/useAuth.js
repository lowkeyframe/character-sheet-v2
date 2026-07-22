import { useCallback, useState } from 'react'
import * as studentService from '../services/studentService'

export function useAuth() {
  const [session, setSession] = useState(null) // { code, password } | null
  const [visitedCode, setVisitedCode] = useState(null) // code of a peer being consulted read-only
  const [error, setError] = useState(null)

  const loginStudent = useCallback(async (code, password) => {
    setError(null)
    try {
      await studentService.login(code, password)
      setSession({ code, password })
      setVisitedCode(null)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    setVisitedCode(null)
    setError(null)
  }, [])

  const visitPeer = useCallback((code) => {
    setError(null)
    if (session && code === session.code) {
      // returning to one's own sheet, not a self-visit
      setVisitedCode(null)
      return
    }
    setVisitedCode(code)
  }, [session])

  const exitVisit = useCallback(() => {
    setVisitedCode(null)
  }, [])

  const activeCode = visitedCode ?? session?.code ?? null
  const isOwner = activeCode !== null && visitedCode === null && activeCode === session?.code
  const canEndorseAs = session?.code ?? null

  return {
    session,
    visitedCode,
    activeCode,
    isOwner,
    canEndorseAs,
    error,
    loginStudent,
    logout,
    visitPeer,
    exitVisit,
  }
}
