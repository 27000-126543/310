import { NavLink, Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  LayoutDashboard,
  Building2,
  Palette,
  Scissors,
  Sparkles,
  ArrowLeftRight,
  Wrench,
  BarChart3,
  Trophy,
  Coins,
  Star,
  Crown,
} from "lucide-react"
import { useGameStore } from "@/store"

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "总控台" },
  { to: "/studio", icon: Building2, label: "工作室" },
  { to: "/design", icon: Palette, label: "设计工坊" },
  { to: "/craft", icon: Scissors, label: "制作车间" },
  { to: "/show", icon: Sparkles, label: "时装秀" },
  { to: "/trade", icon: ArrowLeftRight, label: "交易中心" },
  { to: "/upgrade", icon: Wrench, label: "升级扩建" },
  { to: "/report", icon: BarChart3, label: "运营报告" },
  { to: "/ranking", icon: Trophy, label: "排行榜" },
]

export default function Layout() {
  const studio = useGameStore((s) => s.studio)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-dark-900 font-body text-gray-200">
      <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-dark-500/30 bg-dark-800">
        <div className="flex items-center gap-3 border-b border-dark-500/30 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient">
            <Crown className="h-5 w-5 text-dark-900" />
          </div>
          <h1 className="font-display text-lg font-bold text-gold-400">时尚工坊</h1>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border-l-2 border-gold-400 bg-gold-400/10 text-gold-400"
                    : "text-gray-400 hover:bg-dark-700 hover:text-gray-200"
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-dark-500/30 px-4 py-3">
          <p className="text-xs text-gray-500">Lv.{studio.level} {studio.name}</p>
        </div>
      </aside>

      <div className="ml-64 flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-dark-500/30 bg-dark-800/80 px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-gold-400" />
              <span className="font-display text-sm font-semibold text-gold-400">Lv.{studio.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">{studio.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-neon-pink" />
              <span className="text-sm font-semibold text-neon-pink">{studio.fame.toLocaleString()}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
