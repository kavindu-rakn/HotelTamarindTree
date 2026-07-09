import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth'
import AdminShell from './AdminShell'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  async function signOutAction() {
    'use server'
    await signOut({ redirectTo: '/admin/login' })
  }

  return (
    <AdminShell userEmail={session.user.email ?? ''} signOutAction={signOutAction}>
      {children}
    </AdminShell>
  )
}
