import { motion } from "framer-motion"
import { useGameStore } from "@/store"
import { FACILITY_LABELS, FACILITY_ICONS, FacilityType } from "@/types"
import type { ApprovalRequest, PermissionRole } from "@/types"

const cardVar = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
}

const TYPE_LABEL: Record<ApprovalRequest["type"], string> = { promotion: "晋升", expansion: "扩建" }
const ROLE_LABEL: Record<PermissionRole, string> = { chief: "首席", vice_chief: "副首席", finance: "财务" }

function FacilityCard({ facility, index }: { facility: { id: string; type: FacilityType; level: number; bonusRate: number }; index: number }) {
  const { studio, upgradeFacility } = useGameStore()
  const cost = facility.level * 2000
  const canAfford = studio.coins >= cost

  return (
    <motion.div custom={index} variants={cardVar} initial="hidden" animate="visible" className="card-dark p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{FACILITY_ICONS[facility.type]}</span>
        <div>
          <div className="font-bold text-white">{FACILITY_LABELS[facility.type]}</div>
          <div className="text-xs text-gray-400">Lv.{facility.level}</div>
        </div>
      </div>
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < facility.level ? "bg-gold-400" : "bg-dark-600"}`} />
        ))}
      </div>
      <div className="flex justify-between text-sm mb-4">
        <span className="text-gray-400">加成率</span>
        <span className="text-green-400 font-bold">+{(facility.bonusRate * 100).toFixed(0)}%</span>
      </div>
      <button
        disabled={!canAfford}
        onClick={() => upgradeFacility(facility.id)}
        className={`btn-gold w-full text-sm ${!canAfford ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        升级 · {cost.toLocaleString()} 金币
      </button>
    </motion.div>
  )
}

function ApprovalQueue() {
  const { approvals, approveRequest, rejectRequest } = useGameStore()
  const pending = approvals.filter((a) => a.status === "pending")

  if (pending.length === 0) return null

  return (
    <div>
      <h2 className="section-title">审批队列</h2>
      <div className="space-y-3">
        {pending.map((a, i) => (
          <motion.div key={a.id} custom={i} variants={cardVar} initial="hidden" animate="visible" className="card-gold p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-neon-pink/20 text-neon-pink">
                {TYPE_LABEL[a.type]}
              </span>
              <span className="text-xs text-gray-500">需要{ROLE_LABEL[a.requiredRole]}审批</span>
            </div>
            <div className="font-bold text-white mb-1">{a.targetName}</div>
            <div className="text-xs text-gray-400 mb-3">申请人：{a.requestedBy}</div>
            <div className="flex gap-3">
              <button onClick={() => approveRequest(a.id)} className="btn-gold flex-1 text-sm">批准</button>
              <button onClick={() => rejectRequest(a.id)} className="btn-outline-gold flex-1 text-sm">拒绝</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function UpgradePage() {
  const facilities = useGameStore((s) => s.facilities)

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div>
        <h2 className="section-title">设施升级</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facilities.map((f, i) => (
            <FacilityCard key={f.id} facility={f} index={i} />
          ))}
        </div>
      </div>
      <ApprovalQueue />
    </div>
  )
}
