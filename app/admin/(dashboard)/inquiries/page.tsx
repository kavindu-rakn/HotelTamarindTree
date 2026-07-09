import { db } from '@/lib/db'
import InquiriesList from './InquiriesList'

export default async function AdminInquiriesPage() {
  const inquiries = await db.inquiry.findMany({
    orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  })

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-[#2C1A12] mb-1">Inquiries</h1>
      <p className="text-sm text-[#6D5840] font-sans mb-8">Messages from the public contact form.</p>

      <InquiriesList inquiries={inquiries.map(i => ({
        id:        i.id,
        name:      i.name,
        email:     i.email,
        phone:     i.phone ?? '',
        subject:   i.subject ?? '',
        message:   i.message,
        isRead:    i.isRead,
        createdAt: i.createdAt.toISOString(),
      }))} />
    </div>
  )
}
