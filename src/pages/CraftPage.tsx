import { useState } from "react"
import { motion } from "framer-motion"
import { Scissors, Frown, Sparkles, Trophy, Wrench } from "lucide-react"
import { useGameStore } from "@/store"
import { calculateCraftSuccessRate } from "@/engine"
import { QUALITY_LABELS, QUALITY_COLORS, AFFIX_LABELS, AFFIX_COLORS } from "@/types"
import type { Quality, AffixType, Design } from "@/types"

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

const MATERIAL_COSTS: Record<string, Record<string, number>> = {
  silk: { silk: 10, cotton: 5 },
  cotton: { cotton: 8, bamboo: 3 },
  leather: { leather: 6, silk: 4 },
  crystal: { crystal: 5, neonThread: 8 },
  neonThread: { neonThread: 10, silk: 3 },
  bamboo: { bamboo: 8, cotton: 4 },
}

const MATERIAL_LABELS: Record<string, string> = {
  silk: "丝绸", cotton: "棉布", leather: "皮革", crystal: "水晶", neonThread: "霓虹丝线", bamboo: "竹纤维",
}

function getDesignCosts(design: Design): Record<string, number> {
  const keys = Object.keys(MATERIAL_COSTS)
  const idx = Math.abs(hashCode(design.id)) % keys.length
  const base = MATERIAL_COSTS[keys[idx]]
  const extra = keys[(idx + 1) % keys.length]
  return { ...base, [extra]: (base[extra] || 0) + Math.ceil(design.fashionIndex / 20) }
}

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

function SuccessGauge({ rate }: { rate: number }) {
  const pct = rate * 100
  const color = pct > 70 ? "#22C55E" : pct >= 40 ? "#EAB308" : "#EF4444"
  const dash = pct * 2.64
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#2A2A45" strokeWidth="8" />
        <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} 264`} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-display font-bold" style={{ color }}>{pct.toFixed(0)}%</span>
        <span className="text-xs text-gray-500">成功率</span>
      </div>
    </div>
  )
}

function QualityBadge({ quality }: { quality: Quality }) {
  return (
    <span className={`badge-${quality} px-2 py-0.5 rounded text-xs font-bold`}
      style={{ color: QUALITY_COLORS[quality], backgroundColor: QUALITY_COLORS[quality] + "20" }}>
      {QUALITY_LABELS[quality]}
    </span>
  )
}

export default function CraftPage() {
  const store = useGameStore()
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [craftResult, setCraftResult] = useState<{ success: boolean; quality: Quality; scoreCap: number } | null>(null)

  const tailor = store.staff.filter((s) => s.role === "tailor").sort((a, b) => b.skillLevel - a.skillLevel)[0]
  const sewingMachine = store.facilities.find((f) => f.type === "sewingMachine")
  const successRate = selectedDesign
    ? calculateCraftSuccessRate(tailor?.skillLevel || 1, sewingMachine?.level || 1)
    : 0

  const costs = selectedDesign ? getDesignCosts(selectedDesign) : {}
  const canAfford = Object.entries(costs).every(([mat, qty]) => (store.studio.materials[mat] || 0) >= qty)

  function handleCraft() {
    if (!selectedDesign || !canAfford) return
    const result = store.craftItem(selectedDesign.id)
    if (result) setCraftResult(result as { success: boolean; quality: Quality; scoreCap: number })
  }

  return (
    <div className="grid grid-cols-12 gap-4 p-4 min-h-screen">
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="col-span-4 space-y-4">
        <div className="card-dark">
          <h2 className="section-title flex items-center gap-2"><Scissors size={18} />设计图</h2>
          <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto">
            {store.designs.map((d) => (
              <button key={d.id} onClick={() => { setSelectedDesign(d); setCraftResult(null) }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedDesign?.id === d.id ? "border-gold-400 shadow-lg shadow-gold-400/20 card-gold" : "border-dark-500/30 hover:border-dark-500/60 card-dark"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{d.name}</span>
                  <span className="text-xs text-gold-400">FI {d.fashionIndex}</span>
                </div>
                {d.affixes.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {d.affixes.map((a) => (
                      <span key={a} className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{ color: AFFIX_COLORS[a as AffixType], backgroundColor: AFFIX_COLORS[a as AffixType] + "20" }}>
                        {AFFIX_LABELS[a as AffixType]}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${selectedDesign?.id === d.id ? "btn-gold" : "text-gray-400"}`}>制作</span>
                </div>
              </button>
            ))}
            {store.designs.length === 0 && <p className="text-xs text-gray-600 text-center py-4">暂无设计图</p>}
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="col-span-4 space-y-4">
        {selectedDesign && !craftResult && (
          <>
            <div className="card-dark">
              <h2 className="section-title">材料消耗</h2>
              <div className="space-y-2">
                {Object.entries(costs).map(([mat, qty]) => {
                  const have = store.studio.materials[mat] || 0
                  const insufficient = have < qty
                  return (
                    <div key={mat} className="flex items-center justify-between">
                      <span className="text-sm">{MATERIAL_LABELS[mat] || mat}</span>
                      <span className={`text-sm font-bold ${insufficient ? "text-red-400" : "text-gray-300"}`}>
                        {have} / {qty}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card-dark flex flex-col items-center">
              <h2 className="section-title self-start">制作成功率</h2>
              <SuccessGauge rate={successRate} />
            </div>

            <div className="card-dark">
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-title">裁缝信息</h2>
                <h2 className="section-title flex items-center gap-2"><Wrench size={14} />设备等级</h2>
              </div>
              <div className="flex items-center justify-between">
                {tailor ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tailor.avatar}</span>
                    <div>
                      <p className="text-sm font-medium">{tailor.name}</p>
                      <p className="text-xs text-gold-400">技能 Lv.{tailor.skillLevel}</p>
                    </div>
                  </div>
                ) : <p className="text-xs text-gray-600">无裁缝</p>}
                <div className="text-center">
                  <p className="text-2xl font-bold text-gold-400">Lv.{sewingMachine?.level || 1}</p>
                  <p className="text-xs text-gray-500">缝纫机</p>
                </div>
              </div>
            </div>

            <button onClick={handleCraft} disabled={!canAfford}
              className="btn-gold w-full disabled:opacity-40 disabled:cursor-not-allowed py-3 text-lg">
              开始制作
            </button>
          </>
        )}

        {craftResult && (
          <motion.div {...fadeUp} className="card-gold flex flex-col items-center gap-4 py-8">
            {craftResult.success ? (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                  <Trophy size={48} className="text-gold-400" />
                </motion.div>
                <QualityBadge quality={craftResult.quality} />
                <p className="text-sm text-gray-400">评分上限：<span className="text-gold-400 font-bold">{craftResult.scoreCap}</span></p>
                <div className="relative">
                  <div className="gold-particles" />
                  <Sparkles size={20} className="text-gold-400 animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <Frown size={48} className="text-red-400" />
                <p className="text-lg font-bold text-red-400">制作失败</p>
                <p className="text-sm text-gray-400">返还30%材料</p>
              </>
            )}
            <button onClick={() => setCraftResult(null)} className="btn-gold mt-2">继续制作</button>
          </motion.div>
        )}

        {!selectedDesign && (
          <div className="card-dark flex items-center justify-center h-64">
            <p className="text-gray-500">选择一个设计图开始制作</p>
          </div>
        )}
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="col-span-4 space-y-4">
        <div className="card-dark">
          <h2 className="section-title">已制作物品</h2>
          <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto">
            {store.craftedItems.map((item) => (
              <div key={item.id} className="p-3 rounded-lg border border-dark-500/30 card-dark">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.designName}</span>
                  <QualityBadge quality={item.quality} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gold-400">FI {item.fashionIndex}</span>
                </div>
                {item.effects.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.effects.map((e, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-500/30 text-gray-400">{e}</span>
                    ))}
                  </div>
                )}
                {item.affixes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.affixes.map((a) => (
                      <span key={a} className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{ color: AFFIX_COLORS[a as AffixType], backgroundColor: AFFIX_COLORS[a as AffixType] + "20" }}>
                        {AFFIX_LABELS[a as AffixType]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {store.craftedItems.length === 0 && <p className="text-xs text-gray-600 text-center py-4">暂无成品</p>}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
