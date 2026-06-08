import { useState } from "react"
import { motion } from "framer-motion"
import { useGameStore } from "@/store"
import { MOCK_REPORT_DATA } from "@/data/mock"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
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
    <div id="report-heatmap">
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
    <div id="report-growth">
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
    <div id="report-income">
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
    <div id="report-radar">
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

function buildHeatmapSvg() {
  const cols = 7
  const size = 40
  const gap = 4
  const rows = Math.ceil(MOCK_REPORT_DATA.heatmap.length / cols)
  const w = cols * (size + gap) + gap
  const h = rows * (size + gap) + gap
  let cells = ""
  MOCK_REPORT_DATA.heatmap.forEach((d, i) => {
    const x = (i % cols) * (size + gap) + gap
    const y = Math.floor(i / cols) * (size + gap) + gap
    cells += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="4" fill="${heatmapColor(d.value)}"/>`
    cells += `<text x="${x + size / 2}" y="${y + size / 2 + 4}" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="11">${d.day}</text>`
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${cells}</svg>`
}

function buildGrowthSvg() {
  const w = 500, h = 220, pad = 40
  const data = growthData
  const maxVal = Math.max(...MOCK_REPORT_DATA.growthCurves.flatMap((c) => c.data))
  const xStep = (w - pad * 2) / (data.length - 1)
  let lines = MOCK_REPORT_DATA.growthCurves.map((c, ci) => {
    const points = c.data.map((v, i) => `${pad + i * xStep},${h - pad - (v / maxVal) * (h - pad * 2)}`).join(" ")
    return `<polyline points="${points}" fill="none" stroke="${LINE_COLORS[ci]}" stroke-width="2"/>`
  }).join("")
  let xLabels = data.map((_, i) => `<text x="${pad + i * xStep}" y="${h - 8}" text-anchor="middle" fill="#666" font-size="11">${`W${i + 1}`}</text>`).join("")
  let legend = MOCK_REPORT_DATA.growthCurves.map((c, ci) =>
    `<text x="${pad + ci * 80}" y="16" fill="${LINE_COLORS[ci]}" font-size="12">${c.name}</text>`
  ).join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${legend}${lines}${xLabels}</svg>`
}

function buildIncomeSvg() {
  const w = 500, h = 220, pad = 40
  const data = MOCK_REPORT_DATA.incomeTrend
  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expense))) * 1.1
  const xStep = (w - pad * 2) / (data.length - 1)
  const toPoint = (key: "income" | "expense", i: number) => `${pad + i * xStep},${h - pad - (data[i][key] / maxVal) * (h - pad * 2)}`
  const incomePoints = data.map((_, i) => toPoint("income", i)).join(" ")
  const expensePoints = data.map((_, i) => toPoint("expense", i)).join(" ")
  const areaPath = `M${incomePoints} L${pad + (data.length - 1) * xStep},${h - pad} L${pad},${h - pad} Z`
  let xLabels = data.map((d, i) => `<text x="${pad + i * xStep}" y="${h - 8}" text-anchor="middle" fill="#666" font-size="11">${d.week}</text>`).join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <path d="${areaPath}" fill="rgba(212,175,55,0.15)"/>
    <polyline points="${incomePoints}" fill="none" stroke="#D4AF37" stroke-width="2"/>
    <polyline points="${expensePoints}" fill="none" stroke="#FF2D78" stroke-width="1.5" stroke-dasharray="4 2"/>
    <text x="${pad}" y="16" fill="#D4AF37" font-size="12">收入</text>
    <text x="${pad + 60}" y="16" fill="#FF2D78" font-size="12">支出</text>
    ${xLabels}
  </svg>`
}

function buildRadarSvg() {
  const cx = 150, cy = 130, r = 100
  const data = MOCK_REPORT_DATA.radarData
  const n = data.length
  const angleStep = (2 * Math.PI) / n
  const offset = -Math.PI / 2
  const pt = (i: number, ratio: number) => {
    const a = offset + i * angleStep
    return `${cx + Math.cos(a) * r * ratio},${cy + Math.sin(a) * r * ratio}`
  }
  let grids = [0.25, 0.5, 0.75, 1].map((ratio) =>
    `<polygon points="${data.map((_, i) => pt(i, ratio)).join(" ")}" fill="none" stroke="#2A2A45" stroke-width="0.5"/>`
  ).join("")
  let axes = data.map((_, i) => `<line x1="${cx}" y1="${cy}" x2="${pt(i, 1).split(",")[0]}" y2="${pt(i, 1).split(",")[1]}" stroke="#2A2A45" stroke-width="0.5"/>`).join("")
  let dataPoints = data.map((d, i) => pt(i, d.value / 100)).join(" ")
  let labels = data.map((d, i) => {
    const a = offset + i * angleStep
    const lx = cx + Math.cos(a) * (r + 18)
    const ly = cy + Math.sin(a) * (r + 18)
    return `<text x="${lx}" y="${ly + 4}" text-anchor="middle" fill="#999" font-size="11">${d.axis}</text>`
  }).join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="260">${grids}${axes}<polygon points="${dataPoints}" fill="rgba(212,175,55,0.25)" stroke="#D4AF37" stroke-width="2"/>${labels}</svg>`
}

async function exportReport(studioName: string) {
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

  const container = document.createElement("div")
  container.style.cssText =
    "position:fixed;left:-9999px;top:0;width:800px;background:#0a0a1a;color:#e0e0e0;font-family:system-ui,-apple-system,sans-serif;padding:32px;"
  container.innerHTML = `
    <h1 style="color:#D4AF37;text-align:center;margin-bottom:8px;font-size:24px">${studioName}</h1>
    <div style="text-align:center;color:#666;margin-bottom:32px;font-size:14px">运营报告 · ${dateStr}</div>
    <h2 style="color:#D4AF37;font-size:18px;margin:28px 0 12px;border-left:3px solid #D4AF37;padding-left:10px">活跃热力图</h2>
    <div style="background:#12122a;border-radius:12px;padding:20px;margin-bottom:16px;display:flex;justify-content:center">${buildHeatmapSvg()}</div>
    <h2 style="color:#D4AF37;font-size:18px;margin:28px 0 12px;border-left:3px solid #D4AF37;padding-left:10px">员工成长曲线</h2>
    <div style="background:#12122a;border-radius:12px;padding:20px;margin-bottom:16px;display:flex;justify-content:center">${buildGrowthSvg()}</div>
    <h2 style="color:#D4AF37;font-size:18px;margin:28px 0 12px;border-left:3px solid #D4AF37;padding-left:10px">收入趋势</h2>
    <div style="background:#12122a;border-radius:12px;padding:20px;margin-bottom:16px;display:flex;justify-content:center">${buildIncomeSvg()}</div>
    <h2 style="color:#D4AF37;font-size:18px;margin:28px 0 12px;border-left:3px solid #D4AF37;padding-left:10px">综合能力雷达</h2>
    <div style="background:#12122a;border-radius:12px;padding:20px;margin-bottom:16px;display:flex;justify-content:center">${buildRadarSvg()}</div>
  `

  document.body.appendChild(container)

  const canvas = await html2canvas(container, {
    backgroundColor: "#0a0a1a",
    scale: 2,
    useCORS: true,
  })

  document.body.removeChild(container)

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF("p", "mm", "a4")
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width

  let yOffset = 0
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgHeight = pdfHeight

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight)
  yOffset += pageHeight

  while (yOffset < imgHeight) {
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, imgHeight)
    yOffset += pageHeight
  }

  pdf.save(`${studioName}_运营报告_${dateStr}.pdf`)
}

export default function ReportPage() {
  const studioName = useGameStore((s) => s.studio.name)
  const [toast, setToast] = useState(false)

  const handleExport = async () => {
    await exportReport(studioName)
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <Heatmap />
      <GrowthCurves />
      <IncomeTrend />
      <RadarSection />
      <div className="text-center">
        <button onClick={handleExport} className="btn-gold">导出PDF报告</button>
      </div>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm z-50 animate-bounce">
          报告已导出
        </div>
      )}
    </div>
  )
}
