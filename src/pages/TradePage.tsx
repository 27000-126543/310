import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Coins, CheckCircle, X, TrendingUp } from "lucide-react"
import { useGameStore } from "@/store"
import { QUALITY_LABELS, QUALITY_COLORS } from "@/types"
import type { Quality, Transaction, Blueprint, ItemType } from "@/types"
import { ALL_BLUEPRINTS } from "@/data/mock"

const TABS = ["市场浏览", "上架出售", "成交记录"]
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }
const stagger = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.06 } } }

function QualityBadge({ quality }: { quality: Quality }) {
  return <span className={`badge-${quality}`}>{QUALITY_LABELS[quality]}</span>
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
}

export default function TradePage() {
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState("")
  const [itemFilter, setItemFilter] = useState<ItemType | "all">("all")
  const [confirmItem, setConfirmItem] = useState<Transaction | null>(null)
  const [prices, setPrices] = useState<Record<string, string>>({})
  const store = useGameStore()

  const filteredMarket = store.marketItems.filter(
    (m) => !m.completed && m.itemName.includes(search) && (itemFilter === "all" || m.itemType === itemFilter)
  )
  const completedTx = store.transactions.filter((t) => t.completed)

  const latestTrend = store.trendEvents[0]
  const trendActive = latestTrend && Date.now() - latestTrend.timestamp < 3600000

  return (
    <motion.div {...fadeUp} className="p-4 pb-16 space-y-4">
      {trendActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/40 via-pink-500/40 to-orange-400/40 border border-purple-400/30 rounded-xl p-3 flex items-center gap-2"
        >
          <TrendingUp size={18} className="text-pink-300 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-sm text-pink-200">{latestTrend.name}</div>
            <div className="text-xs text-purple-200/80 truncate">{latestTrend.description}</div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-2">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === i
                ? "bg-gold-gradient text-dark-900"
                : "bg-dark-700 text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div key="market" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索物品..."
                className="w-full bg-dark-700 border border-dark-500/30 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-gold-400/50 transition-colors placeholder:text-gray-600"
              />
            </div>
            <div className="flex gap-2">
              {([["all", "全部"], ["blueprint", "图纸"], ["clothing", "成衣"]] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setItemFilter(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    itemFilter === value
                      ? "bg-gold-gradient text-dark-900"
                      : "bg-dark-700 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 gap-3">
              {filteredMarket.map((item) => {
                const isBlueprint = item.itemType === "blueprint"
                const bpSuggested = isBlueprint ? store.getSuggestedPrice("blueprint", item.quality as Quality) : null
                return (
                  <motion.div key={item.id} variants={fadeUp} className="card-dark hover:border-gold-400/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        {isBlueprint && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-300 border border-purple-400/30">图纸</span>
                        )}
                        <span className="font-medium text-sm">{item.itemName}</span>
                      </div>
                      {item.quality && <QualityBadge quality={item.quality as Quality} />}
                    </div>
                    <div className="flex items-center gap-1 text-gold-400 font-bold mb-1">
                      <Coins size={14} /> {item.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">卖家: {item.sellerName}</div>
                    <div className="text-xs text-gray-600 mb-1">
                      建议价: {item.suggestedMin.toLocaleString()} ~ {item.suggestedMax.toLocaleString()}
                    </div>
                    {isBlueprint && bpSuggested && (
                      <div className="text-xs text-gold-400/80 mb-1">
                        近7天均价: {bpSuggested.avg.toLocaleString()}
                      </div>
                    )}
                    <div className="mb-3" />
                    <button onClick={() => setConfirmItem(item)} className="btn-gold w-full text-sm">
                      购买
                    </button>
                  </motion.div>
                )
              })}
              {filteredMarket.length === 0 && (
                <div className="col-span-2 text-center text-gray-600 py-10">暂无在售物品</div>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 gap-3">
              {store.craftedItems.map((item) => {
                const suggested = store.getSuggestedPrice("clothing", item.quality)
                return (
                  <motion.div key={item.id} variants={fadeUp} className="card-dark">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{item.designName}</span>
                      <QualityBadge quality={item.quality} />
                    </div>
                    <div className="text-xs text-gray-400 mb-1">时尚指数: {item.fashionIndex}</div>
                    <div className="text-xs space-y-0.5 mb-2">
                      <div className="text-gold-400/80">近7天均价: {suggested.avg.toLocaleString()}</div>
                      <div className="text-green-400/70">建议最低: {suggested.min.toLocaleString()}</div>
                      <div className="text-orange-400/70">建议最高: {suggested.max.toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={prices[item.id] || ""}
                        onChange={(e) =>
                          setPrices((p) => ({ ...p, [item.id]: e.target.value }))
                        }
                        placeholder="定价"
                        className="flex-1 bg-dark-700 border border-dark-500/30 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gold-400/50 transition-colors placeholder:text-gray-600"
                      />
                      <button
                        onClick={() => {
                          const price = Number(prices[item.id])
                          if (price > 0) {
                            store.listOnMarket(item.id, price)
                            setPrices((p) => {
                              const next = { ...p }
                              delete next[item.id]
                              return next
                            })
                          }
                        }}
                        className="btn-gold text-sm px-3"
                      >
                        上架
                      </button>
                    </div>
                  </motion.div>
                )
              })}
              {store.craftedItems.length === 0 && store.blueprints.length === 0 && (
                <div className="col-span-2 text-center text-gray-600 py-10">暂无可出售物品</div>
              )}
            </motion.div>

            <div>
              <h3 className="section-title text-sm mb-2">图纸</h3>
              {store.blueprints.length > 0 ? (
                <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 gap-3">
                  {store.blueprints.map((bp) => {
                    const suggested = store.getSuggestedPrice("blueprint", bp.quality)
                    const stars = "★".repeat(bp.rarity) + "☆".repeat(5 - bp.rarity)
                    return (
                      <motion.div key={bp.id} variants={fadeUp} className="card-dark">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{bp.name}</span>
                          <QualityBadge quality={bp.quality} />
                        </div>
                        <div className="text-xs text-yellow-400/80 mb-1">稀有度: {stars}</div>
                        <div className="text-xs text-gray-400 mb-1">来源: {bp.source}</div>
                        <div className="text-xs space-y-0.5 mb-2">
                          <div className="text-gold-400/80">近7天均价: {suggested.avg.toLocaleString()}</div>
                          <div className="text-green-400/70">建议最低: {suggested.min.toLocaleString()}</div>
                          <div className="text-orange-400/70">建议最高: {suggested.max.toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={prices[bp.id] || ""}
                            onChange={(e) =>
                              setPrices((p) => ({ ...p, [bp.id]: e.target.value }))
                            }
                            placeholder="定价"
                            className="flex-1 bg-dark-700 border border-dark-500/30 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gold-400/50 transition-colors placeholder:text-gray-600"
                          />
                          <button
                            onClick={() => {
                              const price = Number(prices[bp.id])
                              if (price > 0) {
                                store.listBlueprintOnMarket(bp.id, price)
                                setPrices((p) => {
                                  const next = { ...p }
                                  delete next[bp.id]
                                  return next
                                })
                              }
                            }}
                            className="btn-gold text-sm px-3"
                          >
                            上架
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              ) : (
                <div className="text-center text-gray-600 py-6">暂无图纸</div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-2">
            {completedTx.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-dark flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      {tx.itemType === "blueprint" && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-300 border border-purple-400/30">图纸</span>
                      )}
                      <span className="font-medium text-sm">{tx.itemName}</span>
                      {tx.quality && <QualityBadge quality={tx.quality as Quality} />}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tx.sellerName} → {tx.buyerId ? "买家" : "—"} · {formatTime(tx.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gold-400 font-bold text-sm flex-shrink-0">
                  <Coins size={14} /> {tx.price.toLocaleString()}
                </div>
              </motion.div>
            ))}
            {completedTx.length === 0 && (
              <div className="text-center text-gray-600 py-10">暂无成交记录</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setConfirmItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-dark w-80 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="section-title !mb-0">确认购买</h3>
                <button onClick={() => setConfirmItem(null)} className="text-gray-500 hover:text-gray-300">
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{confirmItem.itemName}</span>
                {confirmItem.quality && <QualityBadge quality={confirmItem.quality as Quality} />}
              </div>
              <div className="flex items-center gap-1 text-gold-400 font-bold text-lg justify-center">
                <Coins size={18} /> {confirmItem.price.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 text-center">
                建议价: {confirmItem.suggestedMin.toLocaleString()} ~ {confirmItem.suggestedMax.toLocaleString()}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setConfirmItem(null)} className="btn-outline-gold flex-1 text-sm">
                  取消
                </button>
                <button
                  onClick={() => {
                    const ok = store.purchaseMarketItem(confirmItem.id)
                    if (!ok) alert("金币不足")
                    setConfirmItem(null)
                  }}
                  className="btn-gold flex-1 text-sm"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {completedTx.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-dark-900/95 border-t border-gold-400/20 py-2 overflow-hidden z-40">
          <div className="animate-marquee whitespace-nowrap text-gold-400 text-sm">
            {completedTx
              .map((tx) => `🎉 ${tx.itemName} 以 ${tx.price.toLocaleString()} 金币成交！`)
              .join("   ·   ")}
          </div>
        </div>
      )}
    </motion.div>
  )
}
