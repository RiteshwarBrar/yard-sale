'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('auth/login');
}

export async function initializeEmail(email: string) {
  const supabase = await createClient();
  // ---cut---
  const { data, error } = await supabase.auth.updateUser({ email: email })
}
export async function updateEmail(newEmail: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({ email: newEmail });
}

export async function updatePhone(newPhone: string) { // TO-DO: Implement phone update logic
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({ phone: newPhone });
  revalidatePath('/', 'layout');
}

export async function verifyOTP(
  method: 'email_change' | 'email' | 'sms',
  token: string,
  email?: string,
  phone?: string
) {
  const supabase = await createClient();

  if (method === 'sms') {
    if (!phone) throw new Error('Phone number is required for SMS verification')

    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
    if (error) return { data, error }

    const { error: metaError } = await supabase.auth.updateUser({
      data: { phone },
    })
    if (metaError) {
      console.error('Failed to sync phone into metadata:', metaError)
    }

    revalidatePath('/', 'layout')
    return { data, error }
  }

  // method is 'email' or 'email_change' here
  else {
    if (!email) throw new Error('Email is required for this verification type')

    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: method })
    if (error) return { data, error }

    if (method === 'email_change') {
      const { error: metaError } = await supabase.auth.updateUser({
        data: { email },
      })
      if (metaError) {
        console.error('Failed to sync email into metadata:', metaError)
      }
    }

    revalidatePath('/', 'layout')
    return { data, error }
  }
}
