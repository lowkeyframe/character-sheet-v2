import { supabase } from './supabase'
import { getProjects } from './projectService'

export async function getEndorsementsForStudent(studentCode) {
  const projects = await getProjects(studentCode)
  const projectIds = projects.map(p => p.id)
  if (projectIds.length === 0) return []

  const { data, error } = await supabase
    .from('endorsements')
    .select('*')
    .in('project_id', projectIds)

  if (error) {
    console.error('getEndorsementsForStudent error:', error)
    return []
  }
  return data || []
}

export async function addEndorsement({ code, password }, projectId) {
  const { data, error } = await supabase
    .rpc('add_endorsement_rpc', {
      p_from_code: code,
      p_from_password: password,
      p_project_id: projectId,
    })

  if (error) throw error
  return data
}

export async function removeEndorsement({ code, password }, projectId) {
  const { data, error } = await supabase
    .rpc('remove_endorsement_rpc', {
      p_from_code: code,
      p_from_password: password,
      p_project_id: projectId,
    })

  if (error) throw error
  return data
}
