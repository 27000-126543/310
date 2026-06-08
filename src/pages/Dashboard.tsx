import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Palette, Scissors, Sparkles, ArrowLeftRight, ShoppingBag, Zap, Star, Pen, Users, TrendingUp } from "lucide-react"
import { useGameStore } from "@/store"
import { STYLE_LABELS } from "@/types"
import type { Activity, StyleType } from "@/types"

const container = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const item = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

const PRIORITY_COLOR: Record<string, string> = { high: "bg-red-500", medium: "bg-yellow-500", low: "bg-blue-500" }
const TYPE_LABEL: Record<string, string> = { design: "设计", show: "走秀", trade: "交易", upgrade: "升级" }
const ACTIVITY_ICON: Record<Activity["type"], React.ReactNode> = {
  trade: <ShoppingBag size={14} />, show: <Star size={14} />, upgrade: <Zap size={14} />,
  design: <Pen size={14} />, recruit: <Users size={14} />,
}

function relativeTime(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 60000)
  if (diff < 1) return "刚刚"
  if (diff < 60) return `${diff}分钟前`
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
  return `${Math.floor(diff / 1440)}天前`
}

const ACTIONS = [
  { label: "设计", icon: Palette, path: "/design" },
  { label: "制作", icon: Scissors, path: "/craft" },
  { label: "走秀", icon: Sparkles, path: "/show" },
  { label: "交易", icon: ArrowLeftRight, path: "/trade" },
] as const

export default function Dashboard() {
  const navigate = useNavigate()
  const { studio, designs, todos, activities, trendEvents, completeTodo } = useGameStore()
  const latestTrend = trendEvents.length > 0 && (Date.now() - trendEvents[0].timestamp < 3600000) ? trendEvents[0] : null
  const TREND_STYLE_COLOR: Record<StyleType, string> = { ancient: "border-red-400/50 bg-red-500/10", cyber: "border-cyan-400/50 bg-cyan-500/10", nature: "border-green-400/50 bg-green-500/10" }

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-5 p-4 max-w-lg mx-auto">
      <motion.div variants={item} className="card-dark border-gold-400/40">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-2xl font-bold text-gold-400">{studio.name}</h1>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-neon-pink/20 text-neon-pink">
              {STYLE_LABELS[studio.style]}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-400">Lv.{studio.level}</span>
          </div>
        </div>
        <div className="text-center py-3">
          <div className="text-xs text-dark-500 mb-1 uppercase tracking-widest">总实力</div>
          <div className="text-5xl font-display font-extrabold bg-gold-gradient bg-clip-text text-transparent">
            {studio.power}
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex justify-center gap-5">
        {ACTIONS.map((a) => (
          <button key={a.path} onClick={() => navigate(a.path)}
            className="flex flex-col items-center gap-1.5 group">
            <div className="w-14 h-14 rounded-full border-2 border-gold-400/50 bg-dark-800 flex items-center justify-center
              hover:border-gold-400 hover:shadow-lg hover:shadow-gold-400/20 transition-all duration-300
              animate-pulse-gold group-active:scale-90">
              <a.icon size={22} className="text-gold-400" />
            </div>
            <span className="text-xs text-gray-400 group-hover:text-gold-400 transition-colors">{a.label}</span>
          </button>
        ))}
      </motion.div>

      {latestTrend && (
        <motion.div variants={item} className={`card-dark border ${TREND_STYLE_COLOR[latestTrend.style]} p-3 flex items-center gap-3`}>
          <TrendingUp size={18} className="text-gold-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-gold-400">{latestTrend.name}</p>
            <p className="text-xs text-gray-400">{latestTrend.description}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-400 ml-auto flex-shrink-0">
            {STYLE_LABELS[latestTrend.style]}
          </span>
        </motion.div>
      )}

      <motion.div variants={item}>
        <h2 className="section-title">今日待办</h2>
        <div className="space-y-2">
          {todos.map((t) => (
            <div key={t.id}
              className={`card-dark flex items-center gap-3 transition-opacity ${t.completed ? "opacity-40" : ""}`}>
              <button onClick={() => completeTodo(t.id)}
                className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors
                  ${t.completed ? "bg-gold-400 border-gold-400" : "border-dark-500"}`}>
                {t.completed && <span className="text-dark-900 text-[10px] font-bold">✓</span>}
              </button>
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_COLOR[t.priority]}`} />
              <span className={`flex-1 text-sm ${t.completed ? "line-through" : ""}`}>{t.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-600 text-gray-400">
                {TYPE_LABEL[t.type]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="section-title">实时动态</h2>
        <div className="card-dark max-h-52 overflow-y-auto space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0 text-gold-400 mt-0.5">
                {ACTIVITY_ICON[a.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 leading-snug">{a.message}</p>
                <span className="text-[10px] text-dark-500">{relativeTime(a.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        {[
          { label: "总实力", value: studio.power },
          { label: "金币", value: studio.coins.toLocaleString() },
          { label: "声望", value: studio.fame },
          { label: "设计数", value: designs.length },
        ].map((s) => (
          <div key={s.label} className="card-dark text-center hover:border-gold-400/30 transition-colors">
            <div className="text-[10px] text-dark-500 uppercase tracking-wider mb-1">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
