export type StyleType = "ancient" | "cyber" | "nature"
export type StaffRole = "designer" | "model" | "tailor"
export type Quality = "common" | "fine" | "epic" | "legendary"
export type AffixType = "luminous" | "starry" | "phantom" | "aurora" | "void"
export type FacilityType = "designTable" | "sewingMachine" | "photoStudio"
export type ItemType = "clothing" | "blueprint"
export type ShowEventType = "wardrobe_malfunction" | "model_nervous" | "audience_boom" | "judge_favor"
export type PermissionRole = "chief" | "vice_chief" | "finance"

export interface Studio {
  id: string
  name: string
  style: StyleType
  level: number
  power: number
  coins: number
  fame: number
  materials: Record<string, number>
}

export interface Staff {
  id: string
  name: string
  role: StaffRole
  skillLevel: number
  loyalty: number
  avatar: string
  studioId: string
}

export interface Fabric {
  id: string
  name: string
  rarity: number
  bonus: number
  color: string
  styleAffinity: StyleType[]
}

export interface ColorOption {
  id: string
  name: string
  hex: string
  harmonyScore: number
}

export interface Accessory {
  id: string
  name: string
  rarity: number
  bonus: number
  type: string
  styleAffinity: StyleType[]
}

export interface Design {
  id: string
  name: string
  fabricId: string
  colorId: string
  accessoryIds: string[]
  fashionIndex: number
  affixes: AffixType[]
  effects: string[]
  studioId: string
  createdAt: number
}

export interface CraftResult {
  id: string
  designId: string
  quality: Quality
  scoreCap: number
  success: boolean
  returnedMaterials?: Record<string, number>
  createdAt: number
}

export interface CraftedItem {
  id: string
  designId: string
  designName: string
  quality: Quality
  scoreCap: number
  fashionIndex: number
  affixes: AffixType[]
  effects: string[]
  studioId: string
}

export interface Facility {
  id: string
  type: FacilityType
  level: number
  bonusRate: number
  studioId: string
}

export interface FashionShowEvent {
  type: ShowEventType
  description: string
  impact: number
  timestamp: number
}

export interface FashionShow {
  id: string
  opponentName: string
  opponentPower: number
  judges: string[]
  audienceMood: number
  modelStatus: number
  events: FashionShowEvent[]
  playerScore: number
  opponentScore: number
  fashionIndexScore: number
  audienceVoteScore: number
  judgeScore: number
  rewards: ShowReward[]
  completed: boolean
  scheduledAt: number
}

export interface ShowReward {
  type: "coins" | "fame" | "blueprint" | "fabric"
  name: string
  value: number
  rarity?: number
}

export interface Transaction {
  id: string
  itemId: string
  itemType: ItemType
  itemName: string
  quality?: Quality
  price: number
  suggestedMin: number
  suggestedMax: number
  sellerId: string
  sellerName: string
  buyerId?: string
  timestamp: number
  completed: boolean
}

export interface TrendEvent {
  id: string
  name: string
  style: StyleType
  description: string
  multiplier: number
  timestamp: number
}

export interface ApprovalRequest {
  id: string
  type: "promotion" | "expansion"
  targetName: string
  requestedBy: string
  requiredRole: PermissionRole
  status: "pending" | "approved" | "rejected"
  timestamp: number
}

export interface TodoItem {
  id: string
  title: string
  type: "design" | "show" | "trade" | "upgrade"
  priority: "high" | "medium" | "low"
  completed: boolean
}

export interface Activity {
  id: string
  message: string
  type: "trade" | "show" | "upgrade" | "design" | "recruit"
  timestamp: number
}

export const STYLE_LABELS: Record<StyleType, string> = {
  ancient: "古风",
  cyber: "赛博",
  nature: "自然",
}

export const ROLE_LABELS: Record<StaffRole, string> = {
  designer: "设计师",
  model: "模特",
  tailor: "裁缝",
}

export const QUALITY_LABELS: Record<Quality, string> = {
  common: "普通",
  fine: "精良",
  epic: "史诗",
  legendary: "传说",
}

export const QUALITY_COLORS: Record<Quality, string> = {
  common: "#9CA3AF",
  fine: "#3B82F6",
  epic: "#B388FF",
  legendary: "#D4AF37",
}

export const AFFIX_LABELS: Record<AffixType, string> = {
  luminous: "流光",
  starry: "星空",
  phantom: "幻影",
  aurora: "极光",
  void: "虚空",
}

export const AFFIX_COLORS: Record<AffixType, string> = {
  luminous: "#FFD700",
  starry: "#87CEEB",
  phantom: "#B388FF",
  aurora: "#00FF88",
  void: "#FF2D78",
}

export const FACILITY_LABELS: Record<FacilityType, string> = {
  designTable: "设计台",
  sewingMachine: "缝纫机",
  photoStudio: "摄影棚",
}

export const FACILITY_ICONS: Record<FacilityType, string> = {
  designTable: "🎨",
  sewingMachine: "🧵",
  photoStudio: "📸",
}
