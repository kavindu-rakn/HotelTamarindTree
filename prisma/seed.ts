import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Hotel Tamarind Tree database...\n')

  // ─── Amenities ───────────────────────────────────────────────
  const amenities = await Promise.all([
    prisma.amenity.upsert({ where: { name: 'Free Wi-Fi' },       update: {}, create: { name: 'Free Wi-Fi',        iconKey: 'wifi' } }),
    prisma.amenity.upsert({ where: { name: 'Air Conditioning' }, update: {}, create: { name: 'Air Conditioning',  iconKey: 'thermometer' } }),
    prisma.amenity.upsert({ where: { name: 'Hot Water' },        update: {}, create: { name: 'Hot Water',         iconKey: 'droplets' } }),
    prisma.amenity.upsert({ where: { name: 'Flat-screen TV' },   update: {}, create: { name: 'Flat-screen TV',    iconKey: 'tv' } }),
    prisma.amenity.upsert({ where: { name: 'En-suite Bathroom' },update: {}, create: { name: 'En-suite Bathroom', iconKey: 'bath' } }),
    prisma.amenity.upsert({ where: { name: 'Wardrobe' },         update: {}, create: { name: 'Wardrobe',          iconKey: 'shirt' } }),
    prisma.amenity.upsert({ where: { name: 'Safe Box' },         update: {}, create: { name: 'Safe Box',          iconKey: 'lock' } }),
    prisma.amenity.upsert({ where: { name: 'Garden View' },      update: {}, create: { name: 'Garden View',       iconKey: 'trees' } }),
    prisma.amenity.upsert({ where: { name: 'Balcony' },          update: {}, create: { name: 'Balcony',           iconKey: 'home' } }),
    prisma.amenity.upsert({ where: { name: 'Mini Fridge' },      update: {}, create: { name: 'Mini Fridge',       iconKey: 'refrigerator' } }),
  ])

  const amenityMap = Object.fromEntries(amenities.map(a => [a.name, a.id]))

  // ─── Room Types ───────────────────────────────────────────────
  const deluxeTwin = await prisma.roomType.upsert({
    where: { slug: 'DELUXE_TWIN' },
    update: {},
    create: {
      slug: 'DELUXE_TWIN',
      displayName: 'Deluxe Twin',
      category: 'DELUXE',
      bedConfig: 'Two Single Beds',
      maxOccupancy: 2,
      sizeSqm: 28,
      description: 'Our Deluxe Twin rooms offer a refined retreat with two comfortable single beds, ideal for friends or colleagues travelling together. Styled with warm natural tones that echo the surrounding landscape of Tissamaharama.',
    },
  })

  const deluxeDouble = await prisma.roomType.upsert({
    where: { slug: 'DELUXE_DOUBLE' },
    update: {},
    create: {
      slug: 'DELUXE_DOUBLE',
      displayName: 'Deluxe Double',
      category: 'DELUXE',
      bedConfig: 'One Double Bed',
      maxOccupancy: 2,
      sizeSqm: 28,
      description: 'A sanctuary of calm for couples, our Deluxe Double rooms feature a plush double bed, warm teak accents, and a private en-suite bathroom — all just minutes from Yala National Park.',
    },
  })

  const deluxeTriple = await prisma.roomType.upsert({
    where: { slug: 'DELUXE_TRIPLE' },
    update: {},
    create: {
      slug: 'DELUXE_TRIPLE',
      displayName: 'Deluxe Triple',
      category: 'DELUXE',
      bedConfig: 'Three Single Beds',
      maxOccupancy: 3,
      sizeSqm: 34,
      description: 'Spacious and versatile, the Deluxe Triple accommodates three guests in comfort. Perfect for a small family or a trio of travellers exploring the wildlife wonders of southern Sri Lanka.',
    },
  })

  const family = await prisma.roomType.upsert({
    where: { slug: 'FAMILY' },
    update: {},
    create: {
      slug: 'FAMILY',
      displayName: 'Family Room',
      category: 'FAMILY',
      bedConfig: 'Four Beds',
      maxOccupancy: 4,
      sizeSqm: 42,
      description: 'Our Family Rooms are thoughtfully designed to give every family member their own space without sacrificing togetherness. Four beds, generous floor space, and all the comforts of home in the heart of Tissamaharama.',
    },
  })

  const allRoomTypes = [deluxeTwin, deluxeDouble, deluxeTriple, family]

  // ─── Room Amenities ─────────────────────────────────────────
  const sharedAmenities = ['Free Wi-Fi', 'Air Conditioning', 'Hot Water', 'Flat-screen TV', 'En-suite Bathroom', 'Wardrobe', 'Safe Box', 'Garden View']
  const familyAmenities = [...sharedAmenities, 'Mini Fridge', 'Balcony']

  for (const roomType of [deluxeTwin, deluxeDouble, deluxeTriple]) {
    for (const amenityName of sharedAmenities) {
      await prisma.roomAmenity.upsert({
        where: { roomTypeId_amenityId: { roomTypeId: roomType.id, amenityId: amenityMap[amenityName] } },
        update: {},
        create: { roomTypeId: roomType.id, amenityId: amenityMap[amenityName] },
      })
    }
  }

  for (const amenityName of familyAmenities) {
    await prisma.roomAmenity.upsert({
      where: { roomTypeId_amenityId: { roomTypeId: family.id, amenityId: amenityMap[amenityName] } },
      update: {},
      create: { roomTypeId: family.id, amenityId: amenityMap[amenityName] },
    })
  }

  // ─── Rate Plans ──────────────────────────────────────────────
  // Prices confirmed by hotel management
  const ratePlanData = [
    // Deluxe Twin
    { roomTypeId: deluxeTwin.id, mealPlan: 'BB' as const, priceUsd: 50, isVisible: true },
    { roomTypeId: deluxeTwin.id, mealPlan: 'HB' as const, priceUsd: 60, isVisible: true },
    { roomTypeId: deluxeTwin.id, mealPlan: 'FB' as const, priceUsd: 75, isVisible: false },
    // Deluxe Double
    { roomTypeId: deluxeDouble.id, mealPlan: 'BB' as const, priceUsd: 50, isVisible: true },
    { roomTypeId: deluxeDouble.id, mealPlan: 'HB' as const, priceUsd: 60, isVisible: true },
    { roomTypeId: deluxeDouble.id, mealPlan: 'FB' as const, priceUsd: 75, isVisible: false },
    // Deluxe Triple
    { roomTypeId: deluxeTriple.id, mealPlan: 'BB' as const, priceUsd: 70, isVisible: true },
    { roomTypeId: deluxeTriple.id, mealPlan: 'HB' as const, priceUsd: 90, isVisible: true },
    { roomTypeId: deluxeTriple.id, mealPlan: 'FB' as const, priceUsd: 110, isVisible: false },
    // Family
    { roomTypeId: family.id, mealPlan: 'BB' as const, priceUsd: 100, isVisible: true },
    { roomTypeId: family.id, mealPlan: 'HB' as const, priceUsd: 130, isVisible: true },
    { roomTypeId: family.id, mealPlan: 'FB' as const, priceUsd: 160, isVisible: false },
  ]

  const cancellationPolicy = 'Free cancellation up to 48 hours before check-in. Cancellations within 48 hours will be charged one night\'s stay.'

  for (const rp of ratePlanData) {
    await prisma.ratePlan.upsert({
      where: { roomTypeId_mealPlan: { roomTypeId: rp.roomTypeId, mealPlan: rp.mealPlan } },
      update: { priceUsd: rp.priceUsd },
      create: {
        roomTypeId: rp.roomTypeId,
        mealPlan: rp.mealPlan,
        priceUsd: rp.priceUsd,
        isRefundable: true,
        isVisible: rp.isVisible,
        cancellationPolicy,
      },
    })
  }

  // ─── Room Units ──────────────────────────────────────────────
  const unitData = [
    // Deluxe Twin:   101–106  (floor 1)
    ...Array.from({ length: 6 }, (_, i) => ({ roomTypeId: deluxeTwin.id,   unitNumber: `10${i + 1}`, floor: 1 })),
    // Deluxe Double: 107–112  (floor 1)
    ...Array.from({ length: 6 }, (_, i) => ({ roomTypeId: deluxeDouble.id, unitNumber: `${107 + i}`, floor: 1 })),
    // Deluxe Triple: 113–116  (floor 1)
    ...Array.from({ length: 4 }, (_, i) => ({ roomTypeId: deluxeTriple.id, unitNumber: `${113 + i}`, floor: 1 })),
    // Family:        201–204  (floor 2)
    ...Array.from({ length: 4 }, (_, i) => ({ roomTypeId: family.id,       unitNumber: `20${i + 1}`, floor: 2 })),
  ]

  for (const unit of unitData) {
    await prisma.roomUnit.upsert({
      where: { unitNumber: unit.unitNumber },
      update: {},
      create: unit,
    })
  }

  // ─── Admin User ──────────────────────────────────────────────
  const adminPassword = crypto.randomBytes(12).toString('base64url')
  const passwordHash  = await bcrypt.hash(adminPassword, 12)

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: 'admin@tamarindtree.lk' } })
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: 'admin@tamarindtree.lk',
        passwordHash,
        name: 'Hotel Admin',
        role: 'ADMIN',
      },
    })
    console.log('✅ Admin user created:')
    console.log('   Email:    admin@tamarindtree.lk')
    console.log(`   Password: ${adminPassword}`)
    console.log('   ⚠️  Save this password — it will not be shown again!\n')
  } else {
    console.log('ℹ️  Admin user already exists, skipping.\n')
  }

  console.log(`✅ ${allRoomTypes.length} room types seeded`)
  console.log(`✅ 20 room units seeded (101–116, 201–204)`)
  console.log(`✅ ${ratePlanData.length} rate plans seeded (BB, HB, FB)`)
  console.log(`✅ ${amenities.length} amenities seeded`)
  console.log('\n🎉 Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
