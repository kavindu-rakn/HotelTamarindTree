'use client'

import { useState, useTransition } from 'react'
import { formatDate } from '@/lib/utils'
import { toggleInquiryRead, deleteInquiry } from './actions'
import { Mail, MailOpen, Trash2, Loader2, Phone } from 'lucide-react'

interface InquiryData {
  id: string; name: string; email: string; phone: string
  subject: string; message: string; isRead: boolean; createdAt: string
}

export default function InquiriesList({ inquiries }: { inquiries: InquiryData[] }) {
  if (inquiries.length === 0) {
    return <p className="text-sm text-[#6D5840] font-sans py-12 text-center">No inquiries yet.</p>
  }
  return (
    <div className="space-y-3">
      {inquiries.map(i => <InquiryCard key={i.id} inquiry={i} />)}
    </div>
  )
}

function InquiryCard({ inquiry }: { inquiry: InquiryData }) {
  const [expanded, setExpanded] = useState(!inquiry.isRead)
  const [isPending, startTransition] = useTransition()

  function toggleRead() {
    startTransition(async () => { await toggleInquiryRead(inquiry.id, !inquiry.isRead) })
  }
  function remove() {
    startTransition(async () => { await deleteInquiry(inquiry.id) })
  }

  return (
    <div className={`bg-white rounded-xl border p-5 ${inquiry.isRead ? 'border-[#E5DDD3]' : 'border-[#5e1e12]/30 shadow-[0_0_0_2px_rgba(94,30,18,0.06)]'}`}>
      <div className="flex items-start justify-between gap-4">
        <button onClick={() => setExpanded(!expanded)} className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            {!inquiry.isRead && <span className="w-2 h-2 rounded-full bg-[#5e1e12] shrink-0" />}
            <span className="font-sans font-semibold text-[#2C1A12]">{inquiry.name}</span>
            {inquiry.subject && <span className="text-sm text-[#6D5840] font-sans">· {inquiry.subject}</span>}
          </div>
          <p className="text-xs text-[#6D5840] font-sans">{formatDate(inquiry.createdAt)}</p>
          {expanded && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-[#5a3d2b] font-sans whitespace-pre-wrap">{inquiry.message}</p>
              <div className="flex flex-wrap gap-4 text-xs font-sans text-[#6D5840] pt-1">
                <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-1 hover:text-[#5e1e12]">
                  <Mail size={12} /> {inquiry.email}
                </a>
                {inquiry.phone && (
                  <a href={`tel:${inquiry.phone}`} className="inline-flex items-center gap-1 hover:text-[#5e1e12]">
                    <Phone size={12} /> {inquiry.phone}
                  </a>
                )}
              </div>
            </div>
          )}
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {isPending && <Loader2 size={14} className="animate-spin text-[#6D5840]" />}
          <button onClick={toggleRead} title={inquiry.isRead ? 'Mark unread' : 'Mark read'} className="p-2 text-[#6D5840] hover:text-[#5e1e12] hover:bg-[#FAF7F2] rounded-lg">
            {inquiry.isRead ? <Mail size={15} /> : <MailOpen size={15} />}
          </button>
          <button onClick={remove} title="Delete" className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
