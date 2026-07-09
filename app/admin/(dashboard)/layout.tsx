import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, CalendarCheck, BedDouble, Mail, LogOut } from 'lucide-react'

const NAV = [
  { label: 'Overview',  href: '/admin',           icon: LayoutDashboard },
  { label: 'Bookings',  href: '/admin/bookings',  icon: CalendarCheck },
  { label: 'Rooms',     href: '/admin/rooms',     icon: BedDouble },
  { label: 'Inquiries', href: '/admin/inquiries', icon: Mail },
]

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen flex bg-[#FAF7F2]">
      <aside className="w-64 shrink-0 bg-[#2C1A12] text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-[10px] font-sans font-semibold tracking-widest text-[#C9A96E] uppercase">Hotel Tamarind Tree</p>
          <p className="font-serif text-lg">Staff Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs font-sans text-white/50 truncate mb-2">{session.user.email}</p>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/admin/login' })
            }}
          >
            <button type="submit" className="flex items-center gap-2 text-sm font-sans text-white/70 hover:text-white transition-colors">
              <LogOut size={15} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  )
}
