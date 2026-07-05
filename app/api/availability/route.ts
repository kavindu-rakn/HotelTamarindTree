// app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { findAvailableRoomTypes } from '@/lib/booking-utils'
import { enumToUrlSlug, getRoomImagePath } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const checkInStr  = searchParams.get('checkIn')
  const checkOutStr = searchParams.get('checkOut')
  const guestsStr   = searchParams.get('guests') ?? '1'

  if (!checkInStr || !checkOutStr) {
    return NextResponse.json({ error: 'checkIn and checkOut are required' }, { status: 400 })
  }

  const checkIn  = new Date(checkInStr)
  const checkOut = new Date(checkOutStr)
  const guests   = parseInt(guestsStr, 10)

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })
  }
  if (checkOut <= checkIn) {
    return NextResponse.json({ error: 'checkOut must be after checkIn' }, { status: 400 })
  }
  if (guests < 1 || guests > 8) {
    return NextResponse.json({ error: 'Guests must be between 1 and 8' }, { status: 400 })
  }

  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  const roomTypes = await findAvailableRoomTypes(checkIn, checkOut, guests)

  const results = roomTypes.map(rt => {
    const urlSlug = enumToUrlSlug(rt.slug) ?? rt.slug.toLowerCase()
    const bbPlan = rt.ratePlans.find(p => p.mealPlan === 'BB')
    const hbPlan = rt.ratePlans.find(p => p.mealPlan === 'HB')
    return {
      id:           rt.id,
      slug:         urlSlug,
      enumSlug:     rt.slug,
      displayName:  rt.displayName,
      maxOccupancy: rt.maxOccupancy,
      bedConfig:    rt.bedConfig,
      imagePath:    getRoomImagePath(urlSlug),
      firstUnitId:  rt.units[0]?.id ?? null,
      nights,
      rates: {
        BB: bbPlan ? { id: bbPlan.id, pricePerNight: Number(bbPlan.priceUsd), totalUsd: Number(bbPlan.priceUsd) * nights } : null,
        HB: hbPlan ? { id: hbPlan.id, pricePerNight: Number(hbPlan.priceUsd), totalUsd: Number(hbPlan.priceUsd) * nights } : null,
      },
    }
  })

  return NextResponse.json({ results, checkIn: checkInStr, checkOut: checkOutStr, guests, nights })
}
