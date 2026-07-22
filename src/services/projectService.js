import { supabase } from './supabase'

export async function getProjects(studentCode) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('student_code', studentCode)
    .order('pinned', { ascending: false })
    .order('pin_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getProjects error:', error)
    return []
  }
  return data || []
}

export async function addProject({ code, password }, projectData) {
  const { data, error } = await supabase
    .rpc('add_project_rpc', {
      p_code: code,
      p_password: password,
      p_name: projectData.name,
      p_description: projectData.description,
      p_course: projectData.course,
      p_semester: projectData.semester || '',
      p_skills: projectData.skills || [],
      p_link: projectData.link || '',
    })

  if (error) throw error
  return data
}

export async function updateProject({ code, password }, projectId, projectData) {
  const { data, error } = await supabase
    .rpc('update_project_rpc', {
      p_code: code,
      p_password: password,
      p_project_id: projectId,
      p_name: projectData.name,
      p_description: projectData.description,
      p_course: projectData.course,
      p_semester: projectData.semester || '',
      p_skills: projectData.skills || [],
      p_link: projectData.link || '',
    })

  if (error) throw error
  return data
}

export async function togglePin({ code, password }, projectId, pinned, pinOrder = 1) {
  const { data, error } = await supabase
    .rpc('toggle_pin_rpc', {
      p_code: code,
      p_password: password,
      p_project_id: projectId,
      p_pinned: pinned,
      p_pin_order: pinOrder,
    })

  if (error) throw error
  return data
}

export async function deleteProject({ code, password }, projectId) {
  const { data, error } = await supabase
    .rpc('delete_project_rpc', {
      p_code: code,
      p_password: password,
      p_project_id: projectId,
    })

  if (error) throw error
  return data
}
