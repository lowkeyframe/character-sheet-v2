import { supabase } from './supabase'

export async function getStudent(code) {
  const { data, error } = await supabase
    .from('students')
    .select('code, profile, badges, updated_at, updated_by')
    .eq('code', code)
    .maybeSingle()

  if (error) {
    console.error('getStudent error:', error)
    return null
  }
  return data
}

export async function login(code, password) {
  const { data, error } = await supabase
    .rpc('verify_student_login', { p_code: code, p_password: password })

  if (error) {
    throw new Error(error.message)
  }
  if (!data || data.length === 0) {
    throw new Error('Code ou mot de passe invalide.')
  }
  return data[0]
}

export async function updateProfile({ code, password }, updates) {
  const { data, error } = await supabase
    .rpc('update_student_profile_rpc', {
      p_code: code,
      p_password: password,
      p_updates: updates,
    })

  if (error) throw error
  return data
}
