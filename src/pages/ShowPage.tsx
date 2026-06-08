import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Wand2, Trophy, Swords, Clock } from "lucide-react";
import { useGameStore } from "@/store";
import { calculateShowScore } from "@/engine";

const cardVar = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
};

function barColor(v: number) {
  if (v > 60) return "#22c55e";
  if (v >= 30) return "#eab308";
  return "#ef4444";
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function ShowList({ onSelect }: { onSelect: (id: string) => void }) {
  const shows = useGameStore((s) => s.fashionShows);
  return (
    <div>
      <h2 className="section-title flex items-center gap-2"><Swords size={20} /> 时装秀列表</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shows.map((show, i) => (
          <motion.div key={show.id} custom={i} variants={cardVar} initial="hidden" animate="visible" className="card-dark p-5">
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
              <Clock size={14} /> {formatTime(show.scheduledAt)}
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white text-lg">{show.opponentName}</span>
              <span className="text-yellow-400 text-sm font-semibold">战力 {show.opponentPower}</span>
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {show.judges.map((j) => (
                <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{j}</span>
              ))}
            </div>
            <button className="btn-gold w-full text-sm" onClick={() => onSelect(show.id)}>进入走秀</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LiveShow({ showId, onSettle }: { showId: string; onSettle: (result: ShowResultData) => void }) {
  const { studio, fashionShows, runShowStep, useShowSkill } = useGameStore();
  const show = fashionShows.find((s) => s.id === showId)!;

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-dark p-4 text-center">
        <div className="flex items-center justify-center gap-6">
          <div>
            <div className="text-lg font-bold text-yellow-400">{studio.name}</div>
            <div className="text-2xl font-black text-white">{studio.power}</div>
          </div>
          <Swords size={32} className="text-red-400" />
          <div>
            <div className="text-lg font-bold text-pink-400">{show.opponentName}</div>
            <div className="text-2xl font-black text-white">{show.opponentPower}</div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3 justify-center">
        {show.judges.map((j) => (
          <span key={j} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium">{j}</span>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-dark p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #1a1025 40%, #2d1b4e 70%, #0a0a0a 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.25), transparent 60%)" }} />
        <div className="relative space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">观众情绪</span><span style={{ color: barColor(show.audienceMood) }}>{Math.round(show.audienceMood)}</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${show.audienceMood}%`, background: barColor(show.audienceMood) }} /></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">模特状态</span><span style={{ color: barColor(show.modelStatus) }}>{Math.round(show.modelStatus)}</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${show.modelStatus}%`, background: barColor(show.modelStatus) }} /></div>
          </div>
        </div>
      </motion.div>

      <div className="card-dark p-4 max-h-40 overflow-y-auto space-y-1">
        {show.events.length === 0 && <div className="text-gray-500 text-sm text-center">暂无事件</div>}
        {show.events.map((evt, i) => (
          <div key={i} className={`text-sm px-3 py-1.5 rounded ${evt.impact < 0 ? "bg-red-500/15 text-red-300" : "bg-green-500/15 text-green-300"}`}>
            {evt.description}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm" onClick={() => useShowSkill(showId, "calm")}>
          <Heart size={16} /> 安抚
        </button>
        <button className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm" onClick={() => useShowSkill(showId, "improvise")}>
          <Wand2 size={16} /> 即兴改衣
        </button>
      </div>

      <div className="flex gap-3">
        <button className="btn-gold flex-1 text-sm" onClick={() => runShowStep(showId)}>推进走秀</button>
        <button className="btn-neon-pink flex-1 text-sm" onClick={() => {
          const totalImpact = show.events.reduce((a, e) => a + e.impact, 0);
          const fi = studio.power * 0.6;
          const av = show.audienceMood;
          const js = show.judges.length * 15 + show.modelStatus * 0.3;
          const ps = calculateShowScore(fi, av, js, totalImpact, 0);
          const os = show.opponentPower * (0.5 + Math.random() * 0.5);
          onSettle({
            fashionIndexScore: Math.round(fi), audienceVoteScore: Math.round(av),
            judgeScore: Math.round(js), finalScore: ps,
            opponentScore: Math.round(os), win: ps > os, rewards: show.rewards,
          });
        }}>结算</button>
      </div>
    </div>
  );
}

interface ShowResultData {
  fashionIndexScore: number;
  audienceVoteScore: number;
  judgeScore: number;
  finalScore: number;
  opponentScore: number;
  win: boolean;
  rewards: { type: string; name: string; value: number }[];
}

function ShowResult({ result, onBack }: { result: ShowResultData; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className={`card-dark p-6 text-center ${result.win ? "ring-2 ring-yellow-400" : "ring-2 ring-red-500"}`}>
        <Trophy size={40} className={`mx-auto mb-2 ${result.win ? "text-yellow-400" : "text-red-400"}`} />
        <div className={`text-3xl font-black ${result.win ? "text-yellow-400" : "text-red-400"}`}>
          {result.win ? "胜利" : "落败"}
        </div>
        <div className="text-gray-400 text-sm mt-1">
          {result.finalScore} vs {result.opponentScore}
        </div>
      </div>
      <div className="card-dark p-5 space-y-3">
        <h3 className="section-title">评分明细</h3>
        {[
          ["时尚指数分", result.fashionIndexScore],
          ["观众投票分", result.audienceVoteScore],
          ["评委分", result.judgeScore],
          ["最终评分", result.finalScore],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="text-white font-bold">{val as number}</span>
          </div>
        ))}
      </div>
      {result.rewards.length > 0 && (
        <div className="card-dark p-5 space-y-2">
          <h3 className="section-title">奖励</h3>
          {result.rewards.map((r, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-yellow-400">{r.name}</span>
              <span className="text-white">×{r.value}</span>
            </div>
          ))}
        </div>
      )}
      <button className="btn-gold w-full text-sm" onClick={onBack}>返回列表</button>
    </motion.div>
  );
}

export default function ShowPage() {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [result, setResult] = useState<ShowResultData | null>(null);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {!selectedShow && !result && (
          <motion.div key="list" exit={{ opacity: 0 }}><ShowList onSelect={(id) => setSelectedShow(id)} /></motion.div>
        )}
        {selectedShow && !result && (
          <motion.div key="live" exit={{ opacity: 0 }}>
            <button className="text-sm text-gray-400 hover:text-white mb-3 transition-colors" onClick={() => setSelectedShow(null)}>← 返回列表</button>
            <LiveShow showId={selectedShow} onSettle={(r) => setResult(r)} />
          </motion.div>
        )}
        {result && (
          <motion.div key="result" exit={{ opacity: 0 }}>
            <ShowResult result={result} onBack={() => { setResult(null); setSelectedShow(null); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
