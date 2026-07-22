import { useCallback, useEffect, useState } from 'react'
import * as studentService from '../services/studentService'

export function useStudent(code) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!code) {
      setStudent(null)
      return
    }
    setLoading(true)
    setError(null)
    const data = await studentService.getStudent(code)
    setStudent(data)
    setLoading(false)
  }, [code])

  useEffect(() => {
    refetch()
  }, [refetch])

  const updateProfile = useCallback(async (credentials, updates) => {
    try {
      await studentService.updateProfile(credentials, updates)
      await refetch()
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [refetch])

  return { student, loading, error, refetch, updateProfile }
}
