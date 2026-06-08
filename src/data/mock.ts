import type { Studio, Staff, Fabric, ColorOption, Accessory, Design, CraftedItem, Blueprint, Facility, Transaction, FashionShow, TrendEvent, TodoItem, Activity, ApprovalRequest, StyleType, Quality } from "@/types"

export const MOCK_STUDIO: Studio = {
  id: "studio-1",
  name: "绮梦工坊",
  style: "cyber",
  level: 5,
  power: 860,
  coins: 24500,
  fame: 1200,
  materials: {
    silk: 45,
    cotton: 80,
    leather: 30,
    crystal: 15,
    neonThread: 25,
    bamboo: 20,
  },
}

export const MOCK_STAFF: Staff[] = [
  { id: "s1", name: "林夕颜", role: "designer", skillLevel: 8, loyalty: 92, avatar: "👩‍🎨", studioId: "studio-1" },
  { id: "s2", name: "沈墨白", role: "designer", skillLevel: 6, loyalty: 78, avatar: "🧑‍🎨", studioId: "studio-1" },
  { id: "s3", name: "赵灵儿", role: "model", skillLevel: 9, loyalty: 88, avatar: "💃", studioId: "studio-1" },
  { id: "s4", name: "苏婉清", role: "model", skillLevel: 7, loyalty: 95, avatar: "🧍‍♀️", studioId: "studio-1" },
  { id: "s5", name: "王巧手", role: "tailor", skillLevel: 8, loyalty: 85, avatar: "🧵", studioId: "studio-1" },
  { id: "s6", name: "陈素锦", role: "tailor", skillLevel: 5, loyalty: 72, avatar: "✂️", studioId: "studio-1" },
]

export const MOCK_CANDIDATES: Staff[] = [
  { id: "c1", name: "柳如烟", role: "designer", skillLevel: 7, loyalty: 0, avatar: "👩‍🎨", studioId: "" },
  { id: "c2", name: "白月光", role: "model", skillLevel: 8, loyalty: 0, avatar: "💃", studioId: "" },
  { id: "c3", name: "张锦绣", role: "tailor", skillLevel: 6, loyalty: 0, avatar: "✂️", studioId: "" },
  { id: "c4", name: "风无痕", role: "designer", skillLevel: 9, loyalty: 0, avatar: "🧑‍🎨", studioId: "" },
  { id: "c5", name: "月影纱", role: "model", skillLevel: 5, loyalty: 0, avatar: "🧍‍♀️", studioId: "" },
]

export const MOCK_FABRICS: Fabric[] = [
  { id: "f1", name: "云锦", rarity: 3, bonus: 45, color: "#8B0000", styleAffinity: ["ancient"] },
  { id: "f2", name: "霓虹丝", rarity: 4, bonus: 65, color: "#FF2D78", styleAffinity: ["cyber"] },
  { id: "f3", name: "翠竹纱", rarity: 2, bonus: 30, color: "#228B22", styleAffinity: ["nature"] },
  { id: "f4", name: "星河缎", rarity: 5, bonus: 90, color: "#1E90FF", styleAffinity: ["cyber", "ancient"] },
  { id: "f5", name: "霜雪绒", rarity: 3, bonus: 50, color: "#F0F8FF", styleAffinity: ["nature"] },
  { id: "f6", name: "墨韵绸", rarity: 4, bonus: 60, color: "#2F2F4F", styleAffinity: ["ancient"] },
  { id: "f7", name: "光纤维", rarity: 5, bonus: 85, color: "#00D4FF", styleAffinity: ["cyber"] },
  { id: "f8", name: "藤萝锦", rarity: 2, bonus: 28, color: "#7B68EE", styleAffinity: ["nature"] },
]

export const MOCK_COLORS: ColorOption[] = [
  { id: "c1", name: "绯红", hex: "#DC143C", harmonyScore: 8 },
  { id: "c2", name: "幽蓝", hex: "#191970", harmonyScore: 9 },
  { id: "c3", name: "翡翠", hex: "#50C878", harmonyScore: 7 },
  { id: "c4", name: "鎏金", hex: "#D4AF37", harmonyScore: 9 },
  { id: "c5", name: "冰紫", hex: "#B388FF", harmonyScore: 8 },
  { id: "c6", name: "霓虹粉", hex: "#FF2D78", harmonyScore: 7 },
  { id: "c7", name: "月光白", hex: "#F8F8FF", harmonyScore: 6 },
  { id: "c8", name: "墨黑", hex: "#1A1A2E", harmonyScore: 8 },
  { id: "c9", name: "琥珀橙", hex: "#FF8C00", harmonyScore: 7 },
  { id: "c10", name: "冰川蓝", hex: "#00D4FF", harmonyScore: 8 },
]

export const MOCK_ACCESSORIES: Accessory[] = [
  { id: "a1", name: "流苏耳坠", rarity: 2, bonus: 15, type: "耳饰", styleAffinity: ["ancient"] },
  { id: "a2", name: "全息眼镜", rarity: 3, bonus: 25, type: "眼镜", styleAffinity: ["cyber"] },
  { id: "a3", name: "花藤手环", rarity: 2, bonus: 12, type: "手饰", styleAffinity: ["nature"] },
  { id: "a4", name: "龙纹腰带", rarity: 4, bonus: 40, type: "腰带", styleAffinity: ["ancient"] },
  { id: "a5", name: "光能臂环", rarity: 3, bonus: 22, type: "手饰", styleAffinity: ["cyber"] },
  { id: "a6", name: "星钻项链", rarity: 5, bonus: 55, type: "颈饰", styleAffinity: ["cyber", "ancient"] },
  { id: "a7", name: "叶脉头冠", rarity: 3, bonus: 20, type: "头饰", styleAffinity: ["nature"] },
  { id: "a8", name: "虚拟翼翅", rarity: 4, bonus: 35, type: "背饰", styleAffinity: ["cyber"] },
]

export const MOCK_DESIGNS: Design[] = [
  {
    id: "d1", name: "霓虹幻梦", fabricId: "f2", colorId: "c6", accessoryIds: ["a2", "a5"],
    fashionIndex: 78, affixes: ["luminous"], effects: ["流光溢彩"], studioId: "studio-1", createdAt: Date.now() - 86400000,
  },
  {
    id: "d2", name: "云中锦书", fabricId: "f1", colorId: "c1", accessoryIds: ["a1"],
    fashionIndex: 52, affixes: [], effects: [], studioId: "studio-1", createdAt: Date.now() - 172800000,
  },
]

export const MOCK_CRAFTED_ITEMS: CraftedItem[] = [
  {
    id: "ci1", designId: "d1", designName: "霓虹幻梦", quality: "epic", scoreCap: 90,
    fashionIndex: 78, affixes: ["luminous"], effects: ["流光溢彩"], studioId: "studio-1",
  },
  {
    id: "ci2", designId: "d2", designName: "云中锦书", quality: "fine", scoreCap: 75,
    fashionIndex: 52, affixes: [], effects: [], studioId: "studio-1",
  },
]

export const ALL_BLUEPRINTS: Blueprint[] = [
  { id: "bp-c1", name: "素绢便服图纸", quality: "common", rarity: 1, source: "初始", styleAffinity: ["ancient"], bonus: 5, description: "简约古风便服，入门首选" },
  { id: "bp-c2", name: "棉麻短衫图纸", quality: "common", rarity: 1, source: "初始", styleAffinity: ["nature"], bonus: 5, description: "自然风棉麻短衫，轻盈舒适" },
  { id: "bp-c3", name: "基础光衣图纸", quality: "common", rarity: 1, source: "初始", styleAffinity: ["cyber"], bonus: 5, description: "赛博基础款，日常百搭" },
  { id: "bp-f1", name: "古韵锦衣图纸", quality: "fine", rarity: 2, source: "初始", styleAffinity: ["ancient"], bonus: 12, description: "锦缎华服，古韵悠长" },
  { id: "bp-f2", name: "翠叶轻纱图纸", quality: "fine", rarity: 2, source: "初始", styleAffinity: ["nature"], bonus: 12, description: "翠叶轻纱，清新自然" },
  { id: "bp-f3", name: "霓虹外套图纸", quality: "fine", rarity: 2, source: "初始", styleAffinity: ["cyber"], bonus: 12, description: "霓虹光线外套，赛博街头风" },
  { id: "bp-f4", name: "水墨长袍图纸", quality: "fine", rarity: 2, source: "初始", styleAffinity: ["ancient", "nature"], bonus: 15, description: "水墨山水，双风格融合" },
  { id: "bp-e1", name: "极光披风图纸", quality: "epic", rarity: 4, source: "图纸图鉴", styleAffinity: ["cyber", "nature"], bonus: 28, description: "极光幻彩披风，流光溢彩" },
  { id: "bp-e2", name: "星河战袍图纸", quality: "epic", rarity: 4, source: "图纸图鉴", styleAffinity: ["cyber", "ancient"], bonus: 28, description: "星河璀璨，战袍加身" },
  { id: "bp-e3", name: "幻影流光图纸", quality: "epic", rarity: 4, source: "图纸图鉴", styleAffinity: ["cyber"], bonus: 25, description: "幻影迷踪，流光飞舞" },
  { id: "bp-l1", name: "极光绽放图纸", quality: "legendary", rarity: 5, source: "图纸图鉴", styleAffinity: ["cyber", "nature", "ancient"], bonus: 45, description: "极光绽放，三系通用终极图纸" },
  { id: "bp-l2", name: "虚空裂隙图纸", quality: "legendary", rarity: 5, source: "图纸图鉴", styleAffinity: ["cyber", "ancient"], bonus: 42, description: "虚空裂隙，超越常理的传说" },
]

export const MOCK_FACILITIES: Facility[] = [
  { id: "fac1", type: "designTable", level: 3, bonusRate: 0.15, studioId: "studio-1" },
  { id: "fac2", type: "sewingMachine", level: 2, bonusRate: 0.10, studioId: "studio-1" },
  { id: "fac3", type: "photoStudio", level: 1, bonusRate: 0.05, studioId: "studio-1" },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", itemId: "ci1", itemType: "clothing", itemName: "霓虹幻梦", quality: "epic", price: 3500, suggestedMin: 2800, suggestedMax: 4200, sellerId: "studio-1", sellerName: "绮梦工坊", timestamp: Date.now() - 3600000, completed: true, buyerId: "studio-3" },
  { id: "t2", itemId: "bp1", itemType: "blueprint", itemName: "星河战袍图纸", price: 1200, suggestedMin: 900, suggestedMax: 1500, sellerId: "studio-2", sellerName: "幻影阁", timestamp: Date.now() - 7200000, completed: true, buyerId: "studio-1" },
  { id: "t3", itemId: "ci3", itemType: "clothing", itemName: "翠竹仙衣", quality: "fine", price: 1800, suggestedMin: 1400, suggestedMax: 2200, sellerId: "studio-4", sellerName: "自然之韵", timestamp: Date.now() - 10800000, completed: false },
]

export const MOCK_MARKET_ITEMS: Transaction[] = [
  { id: "m1", itemId: "ci5", itemType: "clothing", itemName: "赛博武装衣", quality: "epic", price: 4200, suggestedMin: 3500, suggestedMax: 5000, sellerId: "studio-5", sellerName: "钢铁玫瑰", timestamp: Date.now(), completed: false },
  { id: "m2", itemId: "ci6", itemType: "clothing", itemName: "古韵凤袍", quality: "legendary", price: 12000, suggestedMin: 10000, suggestedMax: 15000, sellerId: "studio-6", sellerName: "凤栖楼", timestamp: Date.now() - 1800000, completed: false },
  { id: "m3", itemId: "bp2", itemType: "blueprint", itemName: "极光披风图纸", price: 2800, suggestedMin: 2200, suggestedMax: 3400, sellerId: "studio-7", sellerName: "极光社", timestamp: Date.now() - 3600000, completed: false },
  { id: "m4", itemId: "ci7", itemType: "clothing", itemName: "翠叶轻纱", quality: "fine", price: 1500, suggestedMin: 1200, suggestedMax: 1800, sellerId: "studio-4", sellerName: "自然之韵", timestamp: Date.now() - 5400000, completed: false },
  { id: "m5", itemId: "ci8", itemType: "clothing", itemName: "暗影刺客装", quality: "epic", price: 5500, suggestedMin: 4500, suggestedMax: 6500, sellerId: "studio-8", sellerName: "暗夜裁缝", timestamp: Date.now() - 7200000, completed: false },
]

export const MOCK_FASHION_SHOWS: FashionShow[] = [
  {
    id: "fs1", opponentName: "幻影阁", opponentPower: 780,
    judges: ["Anna Wintour", "山本耀司", "Karl Lagerfeld"],
    audienceMood: 75, modelStatus: 82, events: [],
    playerScore: 0, opponentScore: 0,
    fashionIndexScore: 0, audienceVoteScore: 0, judgeScore: 0,
    rewards: [], completed: false, scheduledAt: Date.now() + 3600000,
  },
  {
    id: "fs2", opponentName: "自然之韵", opponentPower: 650,
    judges: ["Coco Chanel", "亚历山大·麦昆", "三宅一生"],
    audienceMood: 0, modelStatus: 0, events: [],
    playerScore: 0, opponentScore: 0,
    fashionIndexScore: 0, audienceVoteScore: 0, judgeScore: 0,
    rewards: [], completed: false, scheduledAt: Date.now() + 7200000,
  },
]

export const MOCK_TREND_EVENTS: TrendEvent[] = [
  { id: "te1", name: "赛博风暴", style: "cyber", description: "全服赛博风格服装热度提升30%", multiplier: 1.3, timestamp: Date.now() - 86400000 },
  { id: "te2", name: "古风复兴", style: "ancient", description: "全服古风风格服装热度提升25%", multiplier: 1.25, timestamp: Date.now() - 172800000 },
]

export const MOCK_TODOS: TodoItem[] = [
  { id: "todo1", title: "完成霓虹幻梦的走秀", type: "show", priority: "high", completed: false },
  { id: "todo2", title: "设计新的赛博系列", type: "design", priority: "medium", completed: false },
  { id: "todo3", title: "升级缝纫机至3级", type: "upgrade", priority: "low", completed: false },
  { id: "todo4", title: "出售云中锦书成衣", type: "trade", priority: "medium", completed: false },
]

export const MOCK_ACTIVITIES: Activity[] = [
  { id: "act1", message: "凤栖楼 出售了 传说级 古韵凤袍，成交价 12000金币", type: "trade", timestamp: Date.now() - 600000 },
  { id: "act2", message: "绮梦工坊 在时装秀中击败了 幻影阁，获得3连胜", type: "show", timestamp: Date.now() - 1200000 },
  { id: "act3", message: "极光社 将设计台升级到了5级", type: "upgrade", timestamp: Date.now() - 1800000 },
  { id: "act4", message: "钢铁玫瑰 设计出了 史诗级 赛博武装衣", type: "design", timestamp: Date.now() - 2400000 },
  { id: "act5", message: "暗夜裁缝 招募了顶级设计师 风无痕", type: "recruit", timestamp: Date.now() - 3000000 },
  { id: "act6", message: "全服触发「赛博风暴」潮流风向事件", type: "trade", timestamp: Date.now() - 3600000 },
]

export const MOCK_APPROVALS: ApprovalRequest[] = [
  { id: "ap1", type: "promotion", targetName: "沈墨白", requestedBy: "林夕颜", requiredRole: "vice_chief", status: "pending", timestamp: Date.now() - 1800000 },
  { id: "ap2", type: "expansion", targetName: "缝纫车间扩建", requestedBy: "王巧手", requiredRole: "finance", status: "pending", timestamp: Date.now() - 3600000 },
]

export const MOCK_RANKINGS = [
  { rank: 1, studioId: "r1", name: "凤栖楼", style: "ancient" as StyleType, power: 1520, coins: 89000, fame: 5200, fashionIndex: 980, members: 12 },
  { rank: 2, studioId: "r2", name: "钢铁玫瑰", style: "cyber" as StyleType, power: 1380, coins: 72000, fame: 4800, fashionIndex: 920, members: 10 },
  { rank: 3, studioId: "r3", name: "极光社", style: "cyber" as StyleType, power: 1250, coins: 65000, fame: 4100, fashionIndex: 870, members: 9 },
  { rank: 4, studioId: "r4", name: "自然之韵", style: "nature" as StyleType, power: 1100, coins: 52000, fame: 3600, fashionIndex: 810, members: 8 },
  { rank: 5, studioId: "studio-1", name: "绮梦工坊", style: "cyber" as StyleType, power: 860, coins: 24500, fame: 1200, fashionIndex: 650, members: 6 },
  { rank: 6, studioId: "r6", name: "暗夜裁缝", style: "cyber" as StyleType, power: 780, coins: 21000, fame: 980, fashionIndex: 580, members: 5 },
  { rank: 7, studioId: "r7", name: "幻影阁", style: "ancient" as StyleType, power: 720, coins: 18500, fame: 850, fashionIndex: 520, members: 5 },
  { rank: 8, studioId: "r8", name: "云裳阁", style: "ancient" as StyleType, power: 650, coins: 15000, fame: 720, fashionIndex: 480, members: 4 },
  { rank: 9, studioId: "r9", name: "绿野仙踪", style: "nature" as StyleType, power: 580, coins: 12000, fame: 600, fashionIndex: 420, members: 4 },
  { rank: 10, studioId: "r10", name: "月光织坊", style: "nature" as StyleType, power: 500, coins: 9500, fame: 480, fashionIndex: 360, members: 3 },
]

export const MOCK_REPORT_DATA = {
  heatmap: Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    value: Math.floor(Math.random() * 100),
  })),
  growthCurves: [
    { name: "林夕颜", data: [3, 4, 4, 5, 6, 6, 7, 7, 8, 8] },
    { name: "沈墨白", data: [2, 3, 3, 4, 4, 5, 5, 6, 6, 6] },
    { name: "王巧手", data: [3, 3, 4, 5, 5, 6, 7, 7, 8, 8] },
  ],
  incomeTrend: [
    { week: "W1", income: 1200, expense: 800 },
    { week: "W2", income: 1800, expense: 1100 },
    { week: "W3", income: 2400, expense: 900 },
    { week: "W4", income: 3100, expense: 1500 },
    { week: "W5", income: 2800, expense: 1200 },
    { week: "W6", income: 3600, expense: 1800 },
    { week: "W7", income: 4200, expense: 2000 },
    { week: "W8", income: 5100, expense: 2200 },
  ],
  radarData: [
    { axis: "设计力", value: 78 },
    { axis: "制作力", value: 65 },
    { axis: "走秀力", value: 82 },
    { axis: "商业力", value: 58 },
    { axis: "影响力", value: 70 },
    { axis: "创新力", value: 88 },
  ],
}
