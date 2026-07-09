'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

export async function toggleInquiryRead(id: string, isRead: boolean) {
  await requireAdmin()
  await db.inquiry.update({ where: { id }, data: { isRead } })
  revalidatePath('/admin/inquiries')
  revalidatePath('/admin')
}

export async function deleteInquiry(id: string) {
  await requireAdmin()
  await db.inquiry.delete({ where: { id } })
  revalidatePath('/admin/inquiries')
  revalidatePath('/admin')
}
