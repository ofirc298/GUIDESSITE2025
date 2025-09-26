import { supabase } from '@/lib/supabase'

export async function getUserByEmail(email: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, name, role, password')
    .eq('email', email)
    .single()

  if (error || !user) return null
  return user
}