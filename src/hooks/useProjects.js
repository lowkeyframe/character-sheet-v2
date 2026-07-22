import { useCallback, useEffect, useState } from 'react'
import * as projectService from '../services/projectService'

export function useProjects(code) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!code) {
      setProjects([])
      return
    }
    setLoading(true)
    const data = await projectService.getProjects(code)
    setProjects(data)
    setLoading(false)
  }, [code])

  useEffect(() => {
    refetch()
  }, [refetch])

  const withRefetch = (fn) => async (credentials, ...args) => {
    setError(null)
    try {
      const result = await fn(credentials, ...args)
      await refetch()
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const addProject = withRefetch(projectService.addProject)
  const updateProject = withRefetch((credentials, projectId, data) =>
    projectService.updateProject(credentials, projectId, data))
  const togglePin = withRefetch((credentials, projectId, pinned, pinOrder) =>
    projectService.togglePin(credentials, projectId, pinned, pinOrder))
  const deleteProject = withRefetch(projectService.deleteProject)

  const pinnedCount = projects.filter(p => p.pinned).length

  return { projects, loading, error, refetch, addProject, updateProject, togglePin, deleteProject, pinnedCount }
}
