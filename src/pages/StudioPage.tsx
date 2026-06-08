import { motion } from "framer-motion";
import { Users, Sparkles, Shield, TrendingUp } from "lucide-react";
import { useGameStore } from "@/store";
import type { StyleType, Staff } from "@/types";
import { ROLE_LABELS, STYLE_LABELS } from "@/types";

const STYLE_ICONS: Record<StyleType, string> = {
  ancient: "🏯",
  cyber: "🌆",
  nature: "🌿",
};

const STYLE_DESCS: Record<StyleType, string> = {
  ancient: "东方古典，华服锦裳",
  cyber: "未来科技，霓虹光影",
  nature: "自然灵动，万物共生",
};

const cardVar = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

function loyaltyColor(v: number) {
  if (v > 60) return "bg-green-500";
  if (v >= 30) return "bg-yellow-500";
  return "bg-red-500";
}

function ProgressBar({ value, max, fill }: { value: number; max: number; fill: string }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${(value / max) * 100}%`, background: fill.replace("bg-", "") }} />
    </div>
  );
}

function StyleSelection() {
  const { studio, setStudioStyle } = useGameStore();
  const styles: StyleType[] = ["ancient", "cyber", "nature"];

  return (
    <div>
      <h2 className="section-title flex items-center gap-2"><Sparkles size={20} /> 风格设定</h2>
      <div className="grid grid-cols-3 gap-4">
        {styles.map((s, i) => {
          const selected = studio.style === s;
          return (
            <motion.div
              key={s}
              custom={i}
              variants={cardVar}
              initial="hidden"
              animate="visible"
              onClick={() => setStudioStyle(s)}
              className={`card-dark cursor-pointer p-6 text-center transition-all ${
                selected ? "ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]" : "hover:ring-1 hover:ring-yellow-400/40"
              }`}
            >
              <div className="text-5xl mb-3">{STYLE_ICONS[s]}</div>
              <div className="text-lg font-bold text-yellow-400">{STYLE_LABELS[s]}</div>
              <div className="text-sm text-gray-400 mt-1">{STYLE_DESCS[s]}</div>
              {selected && <div className="mt-2 text-xs text-yellow-300">✦ 当前风格</div>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StaffCard({ staff, index }: { staff: Staff; index: number }) {
  return (
    <motion.div custom={index} variants={cardVar} initial="hidden" animate="visible" className="card-dark p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{staff.avatar}</span>
        <div>
          <div className="font-bold text-white">{staff.name}</div>
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400">
            {ROLE_LABELS[staff.role]}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>技能</span><span>{staff.skillLevel}/10</span>
          </div>
          <ProgressBar value={staff.skillLevel} max={10} fill="bg-gold-400" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>忠诚</span><span>{staff.loyalty}/100</span>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${loyaltyColor(staff.loyalty)}`} style={{ width: `${staff.loyalty}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StaffList() {
  const staff = useGameStore((s) => s.staff);

  return (
    <div>
      <h2 className="section-title flex items-center gap-2"><Users size={20} /> 员工列表</h2>
      {staff.length === 0 ? (
        <div className="card-dark p-8 text-center text-gray-500">暂无员工</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {staff.map((s, i) => (
            <StaffCard key={s.id} staff={s} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecruitmentPanel() {
  const { candidates, studio, recruitStaff } = useGameStore();

  return (
    <div>
      <h2 className="section-title flex items-center gap-2"><Shield size={20} /> 招聘面板</h2>
      {candidates.length === 0 ? (
        <div className="card-dark p-8 text-center text-gray-500">暂无候选人</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {candidates.map((c, i) => {
            const cost = c.skillLevel * 500;
            const canAfford = studio.coins >= cost;
            return (
              <motion.div key={c.id} custom={i} variants={cardVar} initial="hidden" animate="visible" className="card-dark p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{c.avatar}</span>
                  <div>
                    <div className="font-bold text-white">{c.name}</div>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400">
                      {ROLE_LABELS[c.role]}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>技能</span><span>{c.skillLevel}/10</span>
                </div>
                <div className="progress-bar mb-3">
                  <div className="progress-fill bg-yellow-400" style={{ width: `${(c.skillLevel / 10) * 100}%` }} />
                </div>
                <button
                  disabled={!canAfford}
                  onClick={() => recruitStaff(c)}
                  className={`btn-gold w-full text-sm ${!canAfford ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  招聘 {cost} 金币
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TeamPower() {
  const { studio, staff } = useGameStore();
  const avgSkill = staff.length ? (staff.reduce((a, s) => a + s.skillLevel, 0) / staff.length).toFixed(1) : "0";
  const avgLoyalty = staff.length ? Math.round(staff.reduce((a, s) => a + s.loyalty, 0) / staff.length) : 0;

  return (
    <div>
      <h2 className="section-title flex items-center gap-2"><TrendingUp size={20} /> 团队实力</h2>
      <div className="card-gold p-8 text-center">
        <div className="text-6xl font-black text-yellow-400 mb-2">{studio.power}</div>
        <div className="text-gray-400 text-sm">综合战力</div>
        <div className="mt-4 flex justify-center gap-8 text-sm">
          <div>
            <div className="text-yellow-400 font-bold">{staff.length}</div>
            <div className="text-gray-500">员工数</div>
          </div>
          <div>
            <div className="text-yellow-400 font-bold">{avgSkill}</div>
            <div className="text-gray-500">平均技能</div>
          </div>
          <div>
            <div className="text-yellow-400 font-bold">{avgLoyalty}%</div>
            <div className="text-gray-500">平均忠诚</div>
          </div>
          <div>
            <div className="text-yellow-400 font-bold">Lv.{studio.level}</div>
            <div className="text-gray-500">工作室等级</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <StyleSelection />
      <StaffList />
      <RecruitmentPanel />
      <TeamPower />
    </div>
  );
}
