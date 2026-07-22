import { useMemo, useState } from 'react'
import initialData from '../data/me.json'

function withDefaults(data) {
  return {
    github: { owner: '', repo: '', ...data.github },
    profile: {
      alias: '', bio: '', interests: [], avatarDataUrl: '',
      theme: 'dark-minimal', softSkills: [],
      ...data.profile,
    },
    projects: data.projects || [],
    badges: data.badges || {},
    endorsements: data.endorsements || [],
  }
}

export function useCharacterData() {
  const [data, setData] = useState(() => withDefaults(initialData))
  const [dirty, setDirty] = useState(false)

  const mutate = (updater) => {
    setData(updater)
    setDirty(true)
  }

  const updateProfile = (updates) => {
    mutate(prev => ({ ...prev, profile: { ...prev.profile, ...updates } }))
  }

  const updateGithub = (updates) => {
    mutate(prev => ({ ...prev, github: { ...prev.github, ...updates } }))
  }

  const addProject = (projectData) => {
    const project = {
      id: crypto.randomUUID(),
      pinned: false,
      pinOrder: 1,
      createdAt: new Date().toISOString(),
      ...projectData,
    }
    mutate(prev => ({ ...prev, projects: [project, ...prev.projects] }))
  }

  const updateProject = (id, updates) => {
    mutate(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }

  const deleteProject = (id) => {
    mutate(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }))
  }

  const togglePin = (id, pinned, pinOrder = 1) => {
    updateProject(id, { pinned, pinOrder })
  }

  const addEndorsement = (endorsement) => {
    mutate(prev => ({
      ...prev,
      endorsements: [...prev.endorsements, { date: new Date().toISOString(), ...endorsement }],
    }))
  }

  const addBadge = (badgeId, details) => {
    mutate(prev => ({
      ...prev,
      badges: {
        ...prev.badges,
        [badgeId]: { unlocked: true, unlockedAt: new Date().toISOString(), ...details },
      },
    }))
  }

  const removeBadge = (badgeId) => {
    mutate(prev => {
      const badges = { ...prev.badges }
      delete badges[badgeId]
      return { ...prev, badges }
    })
  }

  const exportData = async () => {
    const json = JSON.stringify(data, null, 2)

    if (import.meta.env.DEV) {
      try {
        const res = await fetch('/api/save-me-json', { method: 'POST', body: json })
        if (res.ok) {
          setDirty(false)
          return 'file'
        }
      } catch {
        // serveur de dev indisponible : on retombe sur le téléchargement
      }
    }

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'me.json'
    a.click()
    URL.revokeObjectURL(url)
    setDirty(false)
    return 'download'
  }

  const pinnedCount = useMemo(() => data.projects.filter(p => p.pinned).length, [data.projects])

  return {
    data,
    dirty,
    updateProfile,
    updateGithub,
    addProject,
    updateProject,
    deleteProject,
    togglePin,
    addEndorsement,
    addBadge,
    removeBadge,
    exportData,
    pinnedCount,
  }
}
