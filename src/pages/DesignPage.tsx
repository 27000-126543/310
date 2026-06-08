import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Sparkles, Palette, Shirt, Gem, ScrollText, BookOpen } from "lucide-react"
import { useGameStore } from "@/store"
import { ALL_BLUEPRINTS } from "@/data/mock"
import { AFFIX_LABELS, AFFIX_COLORS, QUALITY_LABELS, QUALITY_COLORS, STYLE_LABELS } from "@/types"
import type { AffixType, Blueprint, Quality, StyleType } from "@/types"

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

function RarityStars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={10} className={i < count ? "fill-gold-400 text-gold-400" : "text-dark-500"} />
      ))}
    </span>
  )
}

function FashionGauge({ value }: { value: number }) {
  const color = value > 80 ? "#D4AF37" : value > 60 ? "#22C55E" : value > 30 ? "#EAB308" : "#EF4444"
  const pct = Math.min(value, 100)
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#2A2A45" strokeWidth="8" />
        <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${pct * 2.64} 264`} strokeLinecap="round"
          className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display font-bold" style={{ color }}>{value}</span>
        <span className="text-xs text-dark-500">时尚指数</span>
      </div>
    </div>
  )
}

const QUALITY_ORDER: Quality[] = ["legendary", "epic", "fine", "common"]

export default function DesignPage() {
  const store = useGameStore()
  const [designName, setDesignName] = useState("")

  const hasPreview = store.selectedFabric && store.selectedColor

  const codex = store.getBlueprintCodex()

  const codexByQuality = QUALITY_ORDER.map((q) => ({
    quality: q,
    label: QUALITY_LABELS[q],
    color: QUALITY_COLORS[q],
    entries: codex.filter((c) => c.blueprint.quality === q),
  })).filter((g) => g.entries.length > 0)

  return (
    <div className="grid grid-cols-12 gap-4 p-4 min-h-screen">
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="col-span-3 space-y-4">
        <div className="card-dark">
          <h2 className="section-title flex items-center gap-2"><Shirt size={18} />面料选择</h2>
          <div className="grid grid-cols-2 gap-2">
            {store.fabrics.map((f) => (
              <button key={f.id} onClick={() => store.selectFabric(f)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  store.selectedFabric?.id === f.id ? "border-gold-400 shadow-lg shadow-gold-400/20" : "border-dark-500/30 hover:border-dark-500/60"}`}>
                <div className="w-full h-8 rounded mb-1" style={{ backgroundColor: f.color }} />
                <p className="text-xs font-medium truncate">{f.name}</p>
                <RarityStars count={f.rarity} />
                <p className="text-xs text-gold-400 mt-0.5">+{f.bonus}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="card-dark">
          <h2 className="section-title flex items-center gap-2"><ScrollText size={18} />图纸选择</h2>
          {store.blueprints.length > 0 ? (
            <div className="space-y-1.5">
              {store.blueprints.map((bp) => {
                const selected = store.selectedBlueprint?.id === bp.id
                return (
                  <button key={bp.id}
                    onClick={() => store.selectBlueprint(selected ? null : bp)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                      selected ? "border-gold-400 shadow-lg shadow-gold-400/20 bg-gold-400/5" : "border-dark-500/30 hover:border-dark-500/60"}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0"
                        style={{ color: QUALITY_COLORS[bp.quality], backgroundColor: QUALITY_COLORS[bp.quality] + "20" }}>
                        {QUALITY_LABELS[bp.quality]}
                      </span>
                      <p className="text-xs font-medium truncate">{bp.name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <RarityStars count={bp.rarity} />
                      <span className="text-xs text-gold-400">+{bp.bonus}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-600 text-center py-2">暂无图纸</p>
          )}
        </div>

        <div className="card-dark">
          <h2 className="section-title flex items-center gap-2"><Palette size={18} />色彩</h2>
          <div className="grid grid-cols-5 gap-2">
            {store.colors.map((c) => (
              <button key={c.id} onClick={() => store.selectColor(c)}
                className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full border-2 transition-all ${
                  store.selectedColor?.id === c.id ? "border-gold-400 ring-2 ring-gold-400/40" : "border-dark-500/30"}`}
                  style={{ backgroundColor: c.hex }} />
                <span className="text-[10px] text-gray-400">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card-dark max-h-48 overflow-y-auto">
          <h2 className="section-title flex items-center gap-2"><Gem size={18} />配饰</h2>
          <div className="space-y-1.5">
            {store.accessories.map((a) => {
              const sel = store.selectedAccessories.some((s) => s.id === a.id)
              return (
                <button key={a.id} onClick={() => store.toggleAccessory(a)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                    sel ? "border-gold-400/60 bg-gold-400/5" : "border-dark-500/30 hover:border-dark-500/60"}`}>
                  <div>
                    <p className="text-xs font-medium">{a.name}</p>
                    <span className="text-[10px] text-gray-500">{a.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RarityStars count={a.rarity} />
                    <span className="text-xs text-gold-400">+{a.bonus}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="col-span-5 flex flex-col gap-4">
        <div className="card-dark flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 bg-dark-900/50" />
          {hasPreview ? (
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-40 h-56 relative">
                  <div className="absolute inset-0 mx-auto w-0 h-0 border-l-[60px] border-r-[60px] border-b-[100px] border-transparent border-b-current rounded-b-2xl"
                    style={{ color: store.selectedColor!.hex, filter: "drop-shadow(0 0 20px " + store.selectedColor!.hex + "44)" }} />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4"
                    style={{ borderColor: store.selectedColor!.hex, backgroundColor: store.selectedColor!.hex + "33" }} />
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 w-20 h-4 rounded-t-full"
                    style={{ backgroundColor: store.selectedColor!.hex + "88" }} />
                </div>
                {store.currentAffixes.map((affix) => (
                  <motion.div key={affix} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-sm font-bold px-3 py-1 rounded-full"
                    style={{ color: AFFIX_COLORS[affix as AffixType], textShadow: `0 0 10px ${AFFIX_COLORS[affix as AffixType]}`, backgroundColor: AFFIX_COLORS[affix as AffixType] + "20" }}>
                    {AFFIX_LABELS[affix as AffixType]}
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">{store.selectedFabric!.name} · {store.selectedColor!.name}</p>
                {store.selectedBlueprint && (
                  <p className="text-xs mt-1" style={{ color: QUALITY_COLORS[store.selectedBlueprint.quality] }}>
                    📜 {store.selectedBlueprint.name}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="relative z-10 text-gray-500">选择面料和色彩开始设计</p>
          )}
        </div>

        <div className="card-dark flex items-center gap-3">
          <input value={designName} onChange={(e) => setDesignName(e.target.value)}
            placeholder="输入设计名称..." className="flex-1 bg-dark-700 border border-dark-500/30 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold-400/50 transition-colors placeholder:text-gray-600" />
          <button disabled={!hasPreview || !designName.trim()}
            onClick={() => { if (designName.trim()) { store.confirmDesign(designName.trim()); setDesignName("") } }}
            className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
            确认设计
          </button>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="col-span-4 space-y-4">
        <div className="card-dark">
          <h2 className="section-title">时尚指数</h2>
          <FashionGauge value={store.currentFashionIndex} />
          {store.selectedBlueprint && (
            <div className="mt-3 px-2 py-1.5 rounded-lg bg-dark-700/50 border border-dark-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">图纸加成</span>
                <span className="text-sm font-bold text-gold-400">+{store.selectedBlueprint.bonus}</span>
              </div>
            </div>
          )}
        </div>

        {store.selectedBlueprint && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-dark">
            <h2 className="section-title flex items-center gap-2"><ScrollText size={18} />图纸详情</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{store.selectedBlueprint.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                  style={{ color: QUALITY_COLORS[store.selectedBlueprint.quality], backgroundColor: QUALITY_COLORS[store.selectedBlueprint.quality] + "20" }}>
                  {QUALITY_LABELS[store.selectedBlueprint.quality]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">稀有度</span>
                <RarityStars count={store.selectedBlueprint.rarity} />
              </div>
              <div>
                <span className="text-xs text-gray-400 mr-2">风格亲和</span>
                <div className="inline-flex gap-1.5">
                  {store.selectedBlueprint.styleAffinity.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-dark-600 border border-dark-500/30 text-gray-300">
                      {STYLE_LABELS[s]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">加成</span>
                <span className="text-sm font-bold text-gold-400">+{store.selectedBlueprint.bonus}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{store.selectedBlueprint.description}</p>
            </div>
          </motion.div>
        )}

        <div className="card-dark">
          <h2 className="section-title">词缀概率</h2>
          <div className="space-y-2.5">
            {(Object.entries(store.currentAffixProbs) as [AffixType, number][]).map(([affix, prob]) => (
              <div key={affix}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: AFFIX_COLORS[affix] }}>{AFFIX_LABELS[affix]}</span>
                  <span className="text-gray-400">{(prob * 100).toFixed(1)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(prob * 100 * 4, 100)}%`, backgroundColor: AFFIX_COLORS[affix] }} />
                </div>
              </div>
            ))}
            {Object.keys(store.currentAffixProbs).length === 0 && (
              <p className="text-xs text-gray-600 text-center py-2">选择面料和色彩后显示</p>
            )}
          </div>
        </div>

        <div className="card-dark">
          <h2 className="section-title flex items-center gap-2"><Sparkles size={18} />触发词缀</h2>
          {store.currentAffixes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {store.currentAffixes.map((a) => (
                <motion.span key={a} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="px-3 py-1 rounded-full text-sm font-bold animate-pulse-gold"
                  style={{ color: AFFIX_COLORS[a as AffixType], backgroundColor: AFFIX_COLORS[a as AffixType] + "20", boxShadow: `0 0 12px ${AFFIX_COLORS[a as AffixType]}44` }}>
                  {AFFIX_LABELS[a as AffixType]}
                </motion.span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600 text-center py-2">确认设计后随机触发</p>
          )}
        </div>

        <div className="card-dark max-h-64 overflow-y-auto">
          <h2 className="section-title flex items-center gap-2"><BookOpen size={18} />图纸图鉴</h2>
          <div className="space-y-3">
            {codexByQuality.map((group) => (
              <div key={group.quality}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{ color: group.color, backgroundColor: group.color + "20" }}>
                    {group.label}
                  </span>
                  <div className="flex-1 h-px bg-dark-500/20" />
                </div>
                <div className="space-y-1">
                  {group.entries.map(({ blueprint, status }) => (
                    <div key={blueprint.id}
                      className={`flex items-center justify-between py-1 px-2 rounded ${
                        status === "unobtained" ? "opacity-40" : ""}`}>
                      <span className="text-xs">{blueprint.name}</span>
                      {status === "owned" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-bold">已拥有</span>
                      )}
                      {status === "listed" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold">已上架</span>
                      )}
                      {status === "unobtained" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400 font-bold">未获得</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
