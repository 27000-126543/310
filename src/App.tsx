import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "@/components/Layout"
import Dashboard from "@/pages/Dashboard"
import StudioPage from "@/pages/StudioPage"
import DesignPage from "@/pages/DesignPage"
import CraftPage from "@/pages/CraftPage"
import ShowPage from "@/pages/ShowPage"
import TradePage from "@/pages/TradePage"
import UpgradePage from "@/pages/UpgradePage"
import ReportPage from "@/pages/ReportPage"
import RankingPage from "@/pages/RankingPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/design" element={<DesignPage />} />
          <Route path="/craft" element={<CraftPage />} />
          <Route path="/show" element={<ShowPage />} />
          <Route path="/trade" element={<TradePage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
