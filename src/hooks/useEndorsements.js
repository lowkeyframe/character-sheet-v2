import { useCallback, useEffect, useState } from 'react'
import * as endorsementService from '../services/endorsementService'

export function useEndorsements(code) {
  const [endorsements, setEndorsements] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!code) {
      setEndorsements([])
      return
    }
    setLoading(true)
    const data = await endorsementService.getEndorsementsForStudent(code)
    setEndorsements(data)
    setLoading(false)
  }, [code])

  useEffect(() => {
    refetch()
  }, [refetch])

  const addEndorsement = useCallback(async (credentials, projectId) => {
    setError(null)
    try {
      await endorsementService.addEndorsement(credentials, projectId)
      await refetch()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refetch])

  const removeEndorsement = useCallback(async (credentials, projectId) => {
    setError(null)
    try {
      await endorsementService.removeEndorsement(credentials, projectId)
      await refetch()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refetch])

  const hasEndorsed = useCallback((projectId, fromCode) => {
    return endorsements.some(e => e.project_id === projectId && e.from_code === fromCode)
  }, [endorsements])

  return { endorsements, loading, error, refetch, addEndorsement, removeEndorsement, hasEndorsed }
}
