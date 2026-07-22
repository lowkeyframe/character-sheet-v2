import { supabase } from './supabase'

export async function verifyAdmin(username, password) {
  const { data, error } = await supabase
    .rpc('admin_verify_login', { p_username: username, p_password: password })

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error('Identifiants invalides.')
  return data[0]
}

export async function getAllStudents({ username, password }) {
  const { data, error } = await supabase
    .rpc('admin_get_all_students', { p_username: username, p_password: password })

  if (error) throw error
  return data || []
}

export async function importStudents({ username, password }, students) {
  const { data, error } = await supabase
    .rpc('admin_import_students', {
      p_username: username,
      p_password: password,
      p_students: students,
    })

  if (error) throw error
  return data
}

export async function importAdmins({ username, password }, admins) {
  const { data, error } = await supabase
    .rpc('admin_import_admins', {
      p_username: username,
      p_password: password,
      p_admins: admins,
    })

  if (error) throw error
  return data
}

export async function updateStudentBadges({ username, password }, studentCode, badges) {
  const { data, error } = await supabase
    .rpc('admin_update_student_badges', {
      p_username: username,
      p_password: password,
      p_student_code: studentCode,
      p_badges: badges,
    })

  if (error) throw error
  return data
}

export async function logAction({ username, password }, action) {
  const { data, error } = await supabase
    .rpc('admin_log_action', {
      p_username: username,
      p_password: password,
      p_action: action,
    })

  if (error) throw error
  return data
}

export async function getAuditLog({ username, password }) {
  const { data, error } = await supabase
    .rpc('admin_get_audit_log', { p_username: username, p_password: password })

  if (error) throw error
  return data || []
}
