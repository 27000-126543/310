import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store"
import { MOCK_RANKINGS } from "@/data/mock"
import { STYLE_LABELS } from "@/types"
import type { StyleType } from "@/types"

const TABS = [
  { key: "fashionIndex", label: "总时尚指数" },
  { key: "coins", label: "总收入" },
  { key: "fame", label: "品牌影响力" },
] as const

type SortKey = typeof TABS[number]["key"]

const TROPHY = ["🥇", "🥈", "🥉"]
const GLOW = ["shadow-[0_0_24px_rgba(212,175,55,0.5)]", "shadow-[0_0_18px_rgba(192,192,192,0.4)]", "shadow-[0_0_14px_rgba(205,127,50,0.4)]"]
const STYLE_BADGE_COLOR: Record<StyleType, string> = {
  ancient: "bg-red-500/20 text-red-400",
  cyber: "bg-cyan-500/20 text-cyan-400",
  nature: "bg-green-500/20 text-green-400",
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVar = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

function TopCard({ rank, r, score }: { rank: number; r: typeof MOCK_RANKINGS[number]; score: number }) {
  const isPlayer = r.studioId === "studio-1"
  return (
    <motion.div variants={itemVar} className={`card-gold p-5 text-center ${GLOW[rank - 1]} ${isPlayer ? "ring-2 ring-gold-400" : ""}`}>
      <div className="text-4xl mb-2">{TROPHY[rank - 1]}</div>
      <div className="font-bold text-white text-lg">{r.name}</div>
      <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${STYLE_BADGE_COLOR[r.style]}`}>
        {STYLE_LABELS[r.style]}
      </span>
      <div className="stat-value mt-2">{score.toLocaleString()}</div>
    </motion.div>
  )
}

function RankRow({ rank, r, score }: { rank: number; r: typeof MOCK_RANKINGS[number]; score: number }) {
  const isPlayer = r.studioId === "studio-1"
  return (
    <motion.div variants={itemVar}
      className={`card-dark flex items-center gap-4 ${isPlayer ? "ring-2 ring-gold-400" : ""}`}>
      <div className="w-8 text-center font-bold text-gray-500">{rank}</div>
      <div className="flex-1">
        <div className="font-bold text-white">{r.name}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${STYLE_BADGE_COLOR[r.style]}`}>
        {STYLE_LABELS[r.style]}
      </span>
      <div className="stat-value text-base">{score.toLocaleString()}</div>
    </motion.div>
  )
}

export default function RankingPage() {
  const [tab, setTab] = useState<SortKey>("fashionIndex")
  const studioId = useGameStore((s) => s.studio.id)

  const sorted = [...MOCK_RANKINGS].sort((a, b) => b[tab] - a[tab])

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <h2 className="section-title">排行榜</h2>
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === t.key ? "btn-gold" : "btn-outline-gold"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} variants={stagger} initial="hidden" animate="visible">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {sorted.slice(0, 3).map((r, i) => (
              <TopCard key={r.studioId} rank={i + 1} r={r} score={r[tab]} />
            ))}
          </div>
          <div className="space-y-2">
            {sorted.slice(3).map((r, i) => (
              <RankRow key={r.studioId} rank={i + 4} r={r} score={r[tab]} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
