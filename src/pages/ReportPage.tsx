import { motion } from "framer-motion"
import { useGameStore } from "@/store"
import { MOCK_REPORT_DATA } from "@/data/mock"
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line,
} from "recharts"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
}

function heatmapColor(v: number) {
  if (v < 25) return "#1a1a3e"
  if (v < 50) return "#2a3a6e"
  if (v < 75) return "#8B6914"
  return "#D4AF37"
}

const growthData = MOCK_REPORT_DATA.growthCurves[0].data.map((_, idx) => {
  const point: Record<string, string | number> = { week: `W${idx + 1}` }
  MOCK_REPORT_DATA.growthCurves.forEach((c) => { point[c.name] = c.data[idx] })
  return point
})

const LINE_COLORS = ["#D4AF37", "#FF2D78", "#00D4FF"]

function Heatmap() {
  return (
    <div>
      <h2 className="section-title">活跃热力图</h2>
      <motion.div custom={0} variants={fadeIn} initial="hidden" animate="visible" className="card-dark p-4">
        <div className="grid grid-cols-7 gap-2">
          {MOCK_REPORT_DATA.heatmap.map((d) => (
            <div key={d.day} className="aspect-square rounded-md flex items-center justify-center text-xs text-white/70"
              style={{ background: heatmapColor(d.value) }} title={`第${d.day}天: ${d.value}`}>
              {d.day}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function GrowthCurves() {
  return (
    <div>
      <h2 className="section-title">员工成长曲线</h2>
      <motion.div custom={1} variants={fadeIn} initial="hidden" animate="visible" className="card-dark p-4">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A45" />
            <XAxis dataKey="week" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #D4AF37", borderRadius: 8 }} />
            {MOCK_REPORT_DATA.growthCurves.map((c, i) => (
              <Line key={c.name} type="monotone" dataKey={c.name} stroke={LINE_COLORS[i]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

function IncomeTrend() {
  return (
    <div>
      <h2 className="section-title">收入趋势</h2>
      <motion.div custom={2} variants={fadeIn} initial="hidden" animate="visible" className="card-dark p-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MOCK_REPORT_DATA.incomeTrend}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A45" />
            <XAxis dataKey="week" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #D4AF37", borderRadius: 8 }} />
            <Area type="monotone" dataKey="income" stroke="#D4AF37" fill="url(#goldGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="expense" stroke="#FF2D78" fill="#FF2D7808" strokeWidth={1.5} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

function RadarSection() {
  return (
    <div>
      <h2 className="section-title">综合能力雷达</h2>
      <motion.div custom={3} variants={fadeIn} initial="hidden" animate="visible" className="card-dark p-4">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={MOCK_REPORT_DATA.radarData}>
            <PolarGrid stroke="#2A2A45" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#999", fontSize: 12 }} />
            <Radar dataKey="value" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

export default function ReportPage() {
  useGameStore()

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <Heatmap />
      <GrowthCurves />
      <IncomeTrend />
      <RadarSection />
      <div className="text-center">
        <button onClick={() => alert("PDF导出功能开发中")} className="btn-gold">导出PDF报告</button>
      </div>
    </div>
  )
}
