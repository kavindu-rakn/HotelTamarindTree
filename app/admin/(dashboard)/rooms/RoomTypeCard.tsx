'use client'

import { useState, useTransition } from 'react'
import { formatDateShort } from '@/lib/utils'
import {
  updateRoomType, updateRatePlan, toggleUnitActive, addBlockedDate, removeBlockedDate,
} from './actions'
import { Pencil, Check, Loader2, Ban, Plus, Trash2 } from 'lucide-react'

interface RoomTypeData {
  id: string; displayName: string; description: string; bedConfig: string
  maxOccupancy: number; sizeSqm: number | null; isActive: boolean
}
interface RatePlanData {
  id: string; mealPlan: string; priceUsd: number; isVisible: boolean
  isRefundable: boolean; cancellationPolicy: string
}
interface BlockedDateData { id: string; startDate: string; endDate: string; reason: string }
interface UnitData { id: string; unitNumber: string; floor: number | null; isActive: boolean; blockedDates: BlockedDateData[] }

const MEAL_LABELS: Record<string, string> = { BB: 'Bed & Breakfast', HB: 'Half Board', FB: 'Full Board' }

export default function RoomTypeCard({ roomType, ratePlans, units }: {
  roomType: RoomTypeData; ratePlans: RatePlanData[]; units: UnitData[]
}) {
  const [editingType, setEditingType] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-[#E5DDD3] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5DDD3] bg-[#FAF7F2]/50">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-xl font-semibold text-[#2C1A12]">{roomType.displayName}</h2>
          {!roomType.isActive && (
            <span className="text-xs font-sans font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Hidden</span>
          )}
        </div>
        {!editingType && (
          <button onClick={() => setEditingType(true)} className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#5e1e12] hover:underline">
            <Pencil size={13} /> Edit details
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {editingType ? (
          <RoomTypeForm roomType={roomType} onDone={() => setEditingType(false)} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-sans">
            <Detail label="Bed" value={roomType.bedConfig} />
            <Detail label="Max Guests" value={String(roomType.maxOccupancy)} />
            <Detail label="Size" value={roomType.sizeSqm ? `${roomType.sizeSqm} m²` : '—'} />
            <Detail label="Status" value={roomType.isActive ? 'Active' : 'Hidden'} />
            {roomType.description && (
              <div className="col-span-2 sm:col-span-4">
                <p className="text-xs text-[#6D5840] uppercase tracking-wider mb-1">Description</p>
                <p className="text-[#5a3d2b]">{roomType.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Rate plans */}
        <div>
          <h3 className="text-xs font-sans font-semibold text-[#6D5840] uppercase tracking-wider mb-3">Rate Plans</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ratePlans.map(rp => <RatePlanCard key={rp.id} ratePlan={rp} />)}
          </div>
        </div>

        {/* Units */}
        <div>
          <h3 className="text-xs font-sans font-semibold text-[#6D5840] uppercase tracking-wider mb-3">Units ({units.length})</h3>
          <div className="space-y-2">
            {units.map(u => <UnitRow key={u.id} unit={u} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#6D5840] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[#2C1A12] font-semibold">{value}</p>
    </div>
  )
}

function RoomTypeForm({ roomType, onDone }: { roomType: RoomTypeData; onDone: () => void }) {
  const [displayName, setDisplayName] = useState(roomType.displayName)
  const [description, setDescription] = useState(roomType.description)
  const [bedConfig, setBedConfig]     = useState(roomType.bedConfig)
  const [maxOccupancy, setMaxOccupancy] = useState(roomType.maxOccupancy)
  const [sizeSqm, setSizeSqm]         = useState(roomType.sizeSqm?.toString() ?? '')
  const [isActive, setIsActive]       = useState(roomType.isActive)
  const [isPending, startTransition]  = useTransition()
  const [error, setError] = useState('')

  function save() {
    setError('')
    startTransition(async () => {
      try {
        await updateRoomType(roomType.id, {
          displayName, description, bedConfig, maxOccupancy,
          sizeSqm: sizeSqm ? Number(sizeSqm) : null, isActive,
        })
        onDone()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save')
      }
    })
  }

  return (
    <div className="bg-[#FAF7F2] rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Display Name"><input value={displayName} onChange={e => setDisplayName(e.target.value)} className={inputCls} /></Field>
        <Field label="Bed Config"><input value={bedConfig} onChange={e => setBedConfig(e.target.value)} className={inputCls} /></Field>
        <Field label="Max Occupancy"><input type="number" min={1} value={maxOccupancy} onChange={e => setMaxOccupancy(Number(e.target.value))} className={inputCls} /></Field>
        <Field label="Size (m²)"><input type="number" step="0.01" value={sizeSqm} onChange={e => setSizeSqm(e.target.value)} className={inputCls} /></Field>
      </div>
      <Field label="Description"><textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className={inputCls} /></Field>
      <label className="flex items-center gap-2 text-sm font-sans text-[#2C1A12]">
        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Active (visible on public site)
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button onClick={save} disabled={isPending} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5e1e12] text-white text-sm font-sans font-semibold rounded hover:bg-[#7a2a1c] disabled:opacity-50">
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
        </button>
        <button onClick={onDone} className="px-4 py-2 text-sm font-sans font-semibold text-[#6D5840] hover:bg-white rounded">Cancel</button>
      </div>
    </div>
  )
}

function RatePlanCard({ ratePlan }: { ratePlan: RatePlanData }) {
  const [editing, setEditing] = useState(false)
  const [priceUsd, setPriceUsd] = useState(ratePlan.priceUsd)
  const [isVisible, setIsVisible] = useState(ratePlan.isVisible)
  const [isRefundable, setIsRefundable] = useState(ratePlan.isRefundable)
  const [cancellationPolicy, setCancellationPolicy] = useState(ratePlan.cancellationPolicy)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function save() {
    setError('')
    startTransition(async () => {
      try {
        await updateRatePlan(ratePlan.id, { priceUsd, isVisible, isRefundable, cancellationPolicy })
        setEditing(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save')
      }
    })
  }

  if (editing) {
    return (
      <div className="border border-[#5e1e12]/40 rounded-lg p-3 space-y-2">
        <p className="text-xs font-sans font-bold text-[#5e1e12]">{MEAL_LABELS[ratePlan.mealPlan] ?? ratePlan.mealPlan}</p>
        <Field label="Price / night (USD)"><input type="number" step="0.01" value={priceUsd} onChange={e => setPriceUsd(Number(e.target.value))} className={inputCls} /></Field>
        <label className="flex items-center gap-2 text-xs font-sans"><input type="checkbox" checked={isVisible} onChange={e => setIsVisible(e.target.checked)} /> Visible on site</label>
        <label className="flex items-center gap-2 text-xs font-sans"><input type="checkbox" checked={isRefundable} onChange={e => setIsRefundable(e.target.checked)} /> Refundable</label>
        <Field label="Cancellation policy"><textarea rows={2} value={cancellationPolicy} onChange={e => setCancellationPolicy(e.target.value)} className={inputCls} /></Field>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button onClick={save} disabled={isPending} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e1e12] text-white text-xs font-sans font-semibold rounded disabled:opacity-50">
            {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
          </button>
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-xs font-sans font-semibold text-[#6D5840] rounded">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg p-3 ${ratePlan.isVisible ? 'border-[#E5DDD3]' : 'border-dashed border-[#E5DDD3] opacity-70'}`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-sans font-bold text-[#5e1e12]">{ratePlan.mealPlan}</p>
        <button onClick={() => setEditing(true)} className="text-[#6D5840] hover:text-[#5e1e12]"><Pencil size={12} /></button>
      </div>
      <p className="font-serif text-lg font-semibold text-[#2C1A12]">${ratePlan.priceUsd}<span className="text-xs font-sans font-normal text-[#6D5840]">/night</span></p>
      <p className="text-xs text-[#6D5840] font-sans mt-1">
        {MEAL_LABELS[ratePlan.mealPlan] ?? ratePlan.mealPlan}
        {!ratePlan.isVisible && ' · hidden'}
        {!ratePlan.isRefundable && ' · non-refundable'}
      </p>
    </div>
  )
}

function UnitRow({ unit }: { unit: UnitData }) {
  const [isPending, startTransition] = useTransition()
  const [showBlock, setShowBlock] = useState(false)

  function toggle() {
    startTransition(async () => { await toggleUnitActive(unit.id, !unit.isActive) })
  }

  return (
    <div className="border border-[#E5DDD3] rounded-lg">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="font-sans font-semibold text-[#2C1A12] text-sm">Unit {unit.unitNumber}</span>
          {unit.floor != null && <span className="text-xs text-[#6D5840] font-sans">Floor {unit.floor}</span>}
          {!unit.isActive && <span className="text-xs font-sans font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Inactive</span>}
          {unit.blockedDates.length > 0 && (
            <span className="text-xs font-sans text-amber-700">{unit.blockedDates.length} block{unit.blockedDates.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowBlock(!showBlock)} title="Maintenance blocks" className="p-1.5 text-[#6D5840] hover:text-[#5e1e12] hover:bg-[#FAF7F2] rounded">
            <Ban size={14} />
          </button>
          <button onClick={toggle} disabled={isPending} className={`text-xs font-sans font-semibold px-3 py-1 rounded border ${unit.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-700 border-green-200 hover:bg-green-50'} disabled:opacity-50`}>
            {isPending ? '…' : unit.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {showBlock && (
        <div className="px-4 pb-3 pt-1 border-t border-[#E5DDD3] bg-[#FAF7F2]/40">
          {unit.blockedDates.length > 0 && (
            <ul className="space-y-1.5 mb-3 mt-2">
              {unit.blockedDates.map(bd => <BlockedDateRow key={bd.id} blocked={bd} />)}
            </ul>
          )}
          <AddBlockForm unitId={unit.id} />
        </div>
      )}
    </div>
  )
}

function BlockedDateRow({ blocked }: { blocked: BlockedDateData }) {
  const [isPending, startTransition] = useTransition()
  return (
    <li className="flex items-center justify-between text-xs font-sans">
      <span className="text-[#5a3d2b]">
        {formatDateShort(blocked.startDate)} → {formatDateShort(blocked.endDate)}
        {blocked.reason && <span className="text-[#6D5840]"> · {blocked.reason}</span>}
      </span>
      <button
        onClick={() => startTransition(async () => { await removeBlockedDate(blocked.id) })}
        disabled={isPending}
        className="text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      </button>
    </li>
  )
}

function AddBlockForm({ unitId }: { unitId: string }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function add() {
    setError('')
    startTransition(async () => {
      try {
        await addBlockedDate({ roomUnitId: unitId, startDate, endDate, reason })
        setStartDate(''); setEndDate(''); setReason('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add block')
      }
    })
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div>
        <label className="block text-[10px] font-sans font-semibold text-[#6D5840] uppercase mb-1">From</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-2 py-1 rounded border border-[#E5DDD3] bg-white text-xs font-sans" />
      </div>
      <div>
        <label className="block text-[10px] font-sans font-semibold text-[#6D5840] uppercase mb-1">To</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-2 py-1 rounded border border-[#E5DDD3] bg-white text-xs font-sans" />
      </div>
      <div className="flex-1 min-w-[120px]">
        <label className="block text-[10px] font-sans font-semibold text-[#6D5840] uppercase mb-1">Reason</label>
        <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Maintenance…" className="w-full px-2 py-1 rounded border border-[#E5DDD3] bg-white text-xs font-sans" />
      </div>
      <button onClick={add} disabled={isPending || !startDate || !endDate} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5e1e12] text-white text-xs font-sans font-semibold rounded disabled:opacity-50">
        {isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Block
      </button>
      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 rounded-lg border border-[#E5DDD3] bg-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-1 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}
