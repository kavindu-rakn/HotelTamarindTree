'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function updateRoomType(id: string, data: {
  displayName: string
  description: string
  bedConfig: string
  maxOccupancy: number
  sizeSqm: number | null
  isActive: boolean
}) {
  await requireAdmin()
  await db.roomType.update({
    where: { id },
    data: {
      displayName:  data.displayName,
      description:  data.description || null,
      bedConfig:    data.bedConfig,
      maxOccupancy: data.maxOccupancy,
      sizeSqm:      data.sizeSqm,
      isActive:     data.isActive,
    },
  })
  revalidatePath('/admin/rooms')
}

export async function updateRatePlan(id: string, data: {
  priceUsd: number
  isVisible: boolean
  isRefundable: boolean
  cancellationPolicy: string
}) {
  await requireAdmin()
  await db.ratePlan.update({
    where: { id },
    data: {
      priceUsd:           data.priceUsd,
      isVisible:          data.isVisible,
      isRefundable:       data.isRefundable,
      cancellationPolicy: data.cancellationPolicy || null,
    },
  })
  revalidatePath('/admin/rooms')
}

export async function toggleUnitActive(id: string, isActive: boolean) {
  await requireAdmin()
  await db.roomUnit.update({ where: { id }, data: { isActive } })
  revalidatePath('/admin/rooms')
}

export async function addBlockedDate(input: { roomUnitId: string; startDate: string; endDate: string; reason: string }) {
  await requireAdmin()
  const start = new Date(input.startDate)
  const end   = new Date(input.endDate)
  if (end <= start) throw new Error('End date must be after start date')

  await db.blockedDate.create({
    data: { roomUnitId: input.roomUnitId, startDate: start, endDate: end, reason: input.reason || null },
  })
  revalidatePath('/admin/rooms')
}

export async function removeBlockedDate(id: string) {
  await requireAdmin()
  await db.blockedDate.delete({ where: { id } })
  revalidatePath('/admin/rooms')
}
