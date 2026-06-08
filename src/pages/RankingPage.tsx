import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore } from "@/store"
import { MOCK_RANKINGS } from "@/data/mock"
import { STYLE_LABELS, QUALITY_LABELS, QUALITY_COLORS, FACILITY_LABELS, FACILITY_ICONS } from "@/types"
import type { StyleType, Quality } from "@/types"

const TABS = [
  { key: "fashionIndex", label: "总时尚指数" },
  { key: "coins", label: "总收入" },
  { key: "fame", label: "品牌影响力" },
] as const

type SortKey = typeof TABS[number]["key"]
type RankEntry = typeof MOCK_RANKINGS[number]

const TROPHY = ["🥇", "🥈", "🥉"]
const GLOW = ["shadow-[0_0_24px_rgba(212,175,55,0.5)]", "shadow-[0_0_18px_rgba(192,192,192,0.4)]", "shadow-[0_0_14px_rgba(205,127,50,0.4)]"]
const STYLE_BADGE_COLOR: Record<StyleType, string> = {
  ancient: "bg-red-500/20 text-red-400",
  cyber: "bg-cyan-500/20 text-cyan-400",
  nature: "bg-green-500/20 text-green-400",
}

const FACILITY_TYPES = ["designTable", "sewingMachine", "photoStudio"] as const

const WORK_NAMES: Record<StyleType, string[]> = {
  ancient: ["凤舞九天袍", "墨韵锦衣", "云水禅心裙", "金丝翎羽衣", "汉宫秋月裳"],
  cyber: ["霓虹幻梦衣", "全息战甲", "脉冲光翼装", "量子迷彩服", "光子流线裙"],
  nature: ["翠竹仙衣", "藤萝花语裙", "晨露轻纱", "枫叶织锦", "月光花冠裳"],
}

const QUALITIES: Quality[] = ["common", "fine", "epic", "legendary"]

function seededRand(seed: string, offset: number) {
  let h = 0
  const s = seed + String(offset)
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return (Math.abs(h) % 1000) / 1000
}

function getFacilityLevels(studioId: string, rank: number) {
  const base = Math.max(1, Math.round(6 - rank * 0.5))
  return FACILITY_TYPES.map((type, i) => ({
    type,
    level: Math.min(5, Math.max(1, base + Math.floor(seededRand(studioId, i) * 2))),
  }))
}

function getWorks(studioId: string, style: StyleType) {
  const pool = WORK_NAMES[style]
  const count = 3 + Math.floor(seededRand(studioId, 99) * 3)
  return Array.from({ length: count }, (_, i) => {
    const nameIdx = Math.floor(seededRand(studioId, i * 7) * pool.length)
    const qIdx = Math.floor(seededRand(studioId, i * 13 + 3) * QUALITIES.length)
    const q = QUALITIES[Math.min(qIdx, QUALITIES.length - 1)]
    return { name: pool[nameIdx], quality: q }
  })
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVar = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

function TopCard({ rank, r, score, onSelect }: { rank: number; r: RankEntry; score: number; onSelect: () => void }) {
  const isPlayer = r.studioId === "studio-1"
  return (
    <motion.div variants={itemVar} onClick={onSelect}
      className={`card-gold p-5 text-center cursor-pointer ${GLOW[rank - 1]} ${isPlayer ? "ring-2 ring-gold-400" : ""}`}>
      <div className="text-4xl mb-2">{TROPHY[rank - 1]}</div>
      <div className="font-bold text-white text-lg">{r.name}</div>
      <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${STYLE_BADGE_COLOR[r.style]}`}>
        {STYLE_LABELS[r.style]}
      </span>
      <div className="stat-value mt-2">{score.toLocaleString()}</div>
    </motion.div>
  )
}

function RankRow({ rank, r, score, onSelect }: { rank: number; r: RankEntry; score: number; onSelect: () => void }) {
  const isPlayer = r.studioId === "studio-1"
  return (
    <motion.div variants={itemVar} onClick={onSelect}
      className={`card-dark flex items-center gap-4 cursor-pointer ${isPlayer ? "ring-2 ring-gold-400" : ""}`}>
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

function DetailPanel({ entry, rank, onBack }: { entry: RankEntry; rank: number; onBack: () => void }) {
  const isPlayer = entry.studioId === "studio-1"
  const facilities = getFacilityLevels(entry.studioId, rank)
  const works = getWorks(entry.studioId, entry.style)

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className={`card-dark p-6 ${isPlayer ? "ring-2 ring-gold-400" : ""}`}>
      <button onClick={onBack} className="text-gold-400 text-sm mb-4 hover:text-gold-300 transition-colors">
        ← 返回排行榜
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl text-gold-400 font-bold">{entry.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${STYLE_BADGE_COLOR[entry.style]}`}>
              {STYLE_LABELS[entry.style]}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-400 font-bold">
              第{rank}名
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: "实力", value: entry.power },
          { label: "金币", value: entry.coins },
          { label: "声望", value: entry.fame },
          { label: "时尚指数", value: entry.fashionIndex },
          { label: "成员", value: entry.members },
        ].map((s) => (
          <div key={s.label} className="card-dark p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">{s.label}</div>
            <div className="stat-value text-base">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</div>
          </div>
        ))}
      </div>

      <h3 className="text-white font-bold mb-3">设施等级</h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {facilities.map((f) => (
          <div key={f.type} className="card-dark p-3">
            <div className="flex items-center gap-2 mb-2">
              <span>{FACILITY_ICONS[f.type]}</span>
              <span className="text-sm text-white font-bold">{FACILITY_LABELS[f.type]}</span>
              <span className="text-xs text-gray-400">Lv.{f.level}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < f.level ? "bg-gold-400" : "bg-dark-600"}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-white font-bold mb-3">作品展示</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {works.map((w, i) => (
          <div key={i} className="card-dark p-3 text-center">
            <div className="text-sm text-white font-bold mb-1">{w.name}</div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: QUALITY_COLORS[w.quality] + "22", color: QUALITY_COLORS[w.quality] }}>
              {QUALITY_LABELS[w.quality]}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function RankingPage() {
  const [tab, setTab] = useState<SortKey>("fashionIndex")
  const [selectedStudio, setSelectedStudio] = useState<{ entry: RankEntry; rank: number } | null>(null)
  const studioId = useGameStore((s) => s.studio.id)

  const sorted = [...MOCK_RANKINGS].sort((a, b) => b[tab] - a[tab])
  const rankMap = new Map(sorted.map((r, i) => [r.studioId, i + 1]))

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <h2 className="section-title">排行榜</h2>

      <AnimatePresence mode="wait">
        {selectedStudio ? (
          <DetailPanel key="detail" entry={selectedStudio.entry} rank={selectedStudio.rank}
            onBack={() => setSelectedStudio(null)} />
        ) : (
          <motion.div key="list" variants={stagger} initial="hidden" animate="visible">
            <div className="flex gap-2 mb-6">
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    tab === t.key ? "btn-gold" : "btn-outline-gold"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {sorted.slice(0, 3).map((r, i) => (
                <TopCard key={r.studioId} rank={i + 1} r={r} score={r[tab]}
                  onSelect={() => setSelectedStudio({ entry: r, rank: i + 1 })} />
              ))}
            </div>
            <div className="space-y-2">
              {sorted.slice(3).map((r, i) => (
                <RankRow key={r.studioId} rank={i + 4} r={r} score={r[tab]}
                  onSelect={() => setSelectedStudio({ entry: r, rank: i + 4 })} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
