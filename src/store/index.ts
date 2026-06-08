import { create } from "zustand"
import type { Studio, Staff, Design, CraftedItem, Facility, Transaction, FashionShow, TrendEvent, TodoItem, Activity, ApprovalRequest, Fabric, ColorOption, Accessory, AffixType, Quality, ShowReward, StyleType } from "@/types"
import { MOCK_STUDIO, MOCK_STAFF, MOCK_CANDIDATES, MOCK_DESIGNS, MOCK_CRAFTED_ITEMS, MOCK_FACILITIES, MOCK_TRANSACTIONS, MOCK_MARKET_ITEMS, MOCK_FASHION_SHOWS, MOCK_TREND_EVENTS, MOCK_TODOS, MOCK_ACTIVITIES, MOCK_APPROVALS, MOCK_FABRICS, MOCK_COLORS, MOCK_ACCESSORIES } from "@/data/mock"
import { calculateTeamPower, calculateCraftSuccessRate, rollCraft, determineQuality, calculateScoreCap, calculateFashionIndex, calculateAffixProbability, rollAffixes, suggestPriceRange } from "@/engine"

interface GameState {
  studio: Studio
  staff: Staff[]
  candidates: Staff[]
  designs: Design[]
  craftedItems: CraftedItem[]
  facilities: Facility[]
  transactions: Transaction[]
  marketItems: Transaction[]
  fashionShows: FashionShow[]
  trendEvents: TrendEvent[]
  todos: TodoItem[]
  activities: Activity[]
  approvals: ApprovalRequest[]
  fabrics: Fabric[]
  colors: ColorOption[]
  accessories: Accessory[]

  selectedFabric: Fabric | null
  selectedColor: ColorOption | null
  selectedAccessories: Accessory[]
  currentFashionIndex: number
  currentAffixProbs: Record<string, number>
  currentAffixes: string[]

  updateStudio: (updates: Partial<Studio>) => void
  setStudioStyle: (style: Studio["style"]) => void
  recruitStaff: (candidate: Staff) => void
  setStaff: (staff: Staff[]) => void
  selectFabric: (fabric: Fabric) => void
  selectColor: (color: ColorOption) => void
  toggleAccessory: (accessory: Accessory) => void
  calculateCurrentDesign: () => void
  confirmDesign: (name: string) => Design | null
  craftItem: (designId: string, materialCosts: Record<string, number>) => { success: boolean; quality: Quality; scoreCap: number; returnedMaterials?: Record<string, number> } | null
  completeTodo: (id: string) => void
  addActivity: (message: string, type: Activity["type"]) => void
  upgradeFacility: (facilityId: string) => void
  approveRequest: (id: string) => void
  rejectRequest: (id: string) => void
  listOnMarket: (itemId: string, price: number) => void
  runShowStep: (showId: string) => void
  useShowSkill: (showId: string, skillType: "calm" | "improvise") => void
  settleShow: (showId: string, result: { fashionIndexScore: number; audienceVoteScore: number; judgeScore: number; finalScore: number; opponentScore: number; win: boolean; rewards: ShowReward[] }) => void
  purchaseMarketItem: (itemId: string) => boolean
  addTrendEvent: (event: TrendEvent) => void
  getSuggestedPrice: (itemType: string, quality?: Quality) => { min: number; max: number; avg: number }
}

export const useGameStore = create<GameState>((set, get) => ({
  studio: MOCK_STUDIO,
  staff: MOCK_STAFF,
  candidates: MOCK_CANDIDATES,
  designs: MOCK_DESIGNS,
  craftedItems: MOCK_CRAFTED_ITEMS,
  facilities: MOCK_FACILITIES,
  transactions: MOCK_TRANSACTIONS,
  marketItems: MOCK_MARKET_ITEMS,
  fashionShows: MOCK_FASHION_SHOWS,
  trendEvents: MOCK_TREND_EVENTS,
  todos: MOCK_TODOS,
  activities: MOCK_ACTIVITIES,
  approvals: MOCK_APPROVALS,
  fabrics: MOCK_FABRICS,
  colors: MOCK_COLORS,
  accessories: MOCK_ACCESSORIES,

  selectedFabric: null,
  selectedColor: null,
  selectedAccessories: [],
  currentFashionIndex: 0,
  currentAffixProbs: {},
  currentAffixes: [],

  updateStudio: (updates) => set((state) => ({ studio: { ...state.studio, ...updates } })),

  setStudioStyle: (style) => set((state) => ({ studio: { ...state.studio, style } })),

  recruitStaff: (candidate) => set((state) => {
    const newStaff = { ...candidate, studioId: state.studio.id, loyalty: 50 }
    const cost = candidate.skillLevel * 500
    if (state.studio.coins < cost) return state
    return {
      staff: [...state.staff, newStaff],
      candidates: state.candidates.filter((c) => c.id !== candidate.id),
      studio: { ...state.studio, coins: state.studio.coins - cost, power: calculateTeamPower([...state.staff, newStaff]) },
    }
  }),

  setStaff: (staff) => set((state) => ({
    staff,
    studio: { ...state.studio, power: calculateTeamPower(staff) },
  })),

  selectFabric: (fabric) => {
    set({ selectedFabric: fabric })
    get().calculateCurrentDesign()
  },

  selectColor: (color) => {
    set({ selectedColor: color })
    get().calculateCurrentDesign()
  },

  toggleAccessory: (accessory) => {
    set((state) => {
      const exists = state.selectedAccessories.find((a) => a.id === accessory.id)
      const newList = exists
        ? state.selectedAccessories.filter((a) => a.id !== accessory.id)
        : [...state.selectedAccessories, accessory]
      return { selectedAccessories: newList }
    })
    setTimeout(() => get().calculateCurrentDesign(), 0)
  },

  calculateCurrentDesign: () => {
    const state = get()
    if (!state.selectedFabric || !state.selectedColor) {
      set({ currentFashionIndex: 0, currentAffixProbs: {}, currentAffixes: [] })
      return
    }
    const designer = state.staff.find((s) => s.role === "designer")
    const designerSkill = designer?.skillLevel || 1
    const fi = calculateFashionIndex(state.selectedFabric, state.selectedColor, state.selectedAccessories, state.studio.style, designerSkill)
    const probs = calculateAffixProbability(fi, state.selectedFabric.rarity)
    set({ currentFashionIndex: fi, currentAffixProbs: probs, currentAffixes: [] })
  },

  confirmDesign: (name) => {
    const state = get()
    if (!state.selectedFabric || !state.selectedColor) return null
    const designer = state.staff.find((s) => s.role === "designer")
    const designerSkill = designer?.skillLevel || 1
    const fi = calculateFashionIndex(state.selectedFabric, state.selectedColor, state.selectedAccessories, state.studio.style, designerSkill)
    const probs = calculateAffixProbability(fi, state.selectedFabric.rarity)
    const affixes = rollAffixs(probs)
    const effects = affixes.map((a) => {
      const labels: Record<string, string> = { luminous: "流光溢彩", starry: "星河漫天", phantom: "幻影迷踪", aurora: "极光绽放", void: "虚空裂隙" }
      return labels[a] || a
    })
    const design: Design = {
      id: `d-${Date.now()}`,
      name,
      fabricId: state.selectedFabric.id,
      colorId: state.selectedColor.id,
      accessoryIds: state.selectedAccessories.map((a) => a.id),
      fashionIndex: fi,
      affixes,
      effects,
      studioId: state.studio.id,
      createdAt: Date.now(),
    }
    set((state) => ({
      designs: [...state.designs, design],
      selectedFabric: null,
      selectedColor: null,
      selectedAccessories: [],
      currentFashionIndex: 0,
      currentAffixProbs: {},
      currentAffixes: [],
    }))
    return design
  },

  craftItem: (designId, materialCosts) => {
    const state = get()
    const design = state.designs.find((d) => d.id === designId)
    if (!design) return null

    const canAfford = Object.entries(materialCosts).every(([mat, qty]) => (state.studio.materials[mat] || 0) >= qty)
    if (!canAfford) return null

    const newMaterials = { ...state.studio.materials }
    for (const [mat, qty] of Object.entries(materialCosts)) {
      newMaterials[mat] = (newMaterials[mat] || 0) - qty
    }

    const tailor = state.staff.find((s) => s.role === "tailor")
    const sewingMachine = state.facilities.find((f) => f.type === "sewingMachine")
    const successRate = calculateCraftSuccessRate(tailor?.skillLevel || 1, sewingMachine?.level || 1)
    const success = rollCraft(successRate)

    if (!success) {
      const returnedMaterials: Record<string, number> = {}
      for (const [mat, qty] of Object.entries(materialCosts)) {
        const returned = Math.ceil(qty * 0.3)
        if (returned > 0) {
          returnedMaterials[mat] = returned
          newMaterials[mat] = (newMaterials[mat] || 0) + returned
        }
      }
      set((state) => ({
        studio: { ...state.studio, materials: newMaterials },
      }))
      return { success: false, quality: "common" as Quality, scoreCap: 0, returnedMaterials }
    }

    const quality = determineQuality(design.fashionIndex)
    const scoreCap = calculateScoreCap(quality)
    const item: CraftedItem = {
      id: `ci-${Date.now()}`,
      designId: design.id,
      designName: design.name,
      quality,
      scoreCap,
      fashionIndex: design.fashionIndex,
      affixes: design.affixes,
      effects: design.effects,
      studioId: state.studio.id,
    }
    set((state) => ({
      craftedItems: [...state.craftedItems, item],
      studio: { ...state.studio, materials: newMaterials },
    }))
    return { success: true, quality, scoreCap }
  },

  completeTodo: (id) => set((state) => ({
    todos: state.todos.map((t) => (t.id === id ? { ...t, completed: true } : t)),
  })),

  addActivity: (message, type) => set((state) => ({
    activities: [{ id: `act-${Date.now()}`, message, type, timestamp: Date.now() }, ...state.activities].slice(0, 50),
  })),

  upgradeFacility: (facilityId) => set((state) => {
    const facility = state.facilities.find((f) => f.id === facilityId)
    if (!facility) return state
    const cost = facility.level * 2000
    if (state.studio.coins < cost) return state
    return {
      facilities: state.facilities.map((f) =>
        f.id === facilityId ? { ...f, level: f.level + 1, bonusRate: f.bonusRate + 0.05 } : f
      ),
      studio: { ...state.studio, coins: state.studio.coins - cost },
    }
  }),

  approveRequest: (id) => set((state) => ({
    approvals: state.approvals.map((a) => (a.id === id ? { ...a, status: "approved" as const } : a)),
  })),

  rejectRequest: (id) => set((state) => ({
    approvals: state.approvals.map((a) => (a.id === id ? { ...a, status: "rejected" as const } : a)),
  })),

  listOnMarket: (itemId, price) => set((state) => {
    const item = state.craftedItems.find((ci) => ci.id === itemId)
    if (!item) return state
    const suggested = get().getSuggestedPrice("clothing", item.quality)
    const listing: Transaction = {
      id: `t-${Date.now()}`,
      itemId: item.id,
      itemType: "clothing",
      itemName: item.designName,
      quality: item.quality,
      price,
      suggestedMin: suggested.min,
      suggestedMax: suggested.max,
      sellerId: state.studio.id,
      sellerName: state.studio.name,
      timestamp: Date.now(),
      completed: false,
    }
    return {
      craftedItems: state.craftedItems.filter((ci) => ci.id !== itemId),
      marketItems: [...state.marketItems, listing],
    }
  }),

  runShowStep: (showId) => set((state) => {
    const show = state.fashionShows.find((s) => s.id === showId)
    if (!show || show.completed) return state
    const moodDelta = Math.random() * 20 - 5
    const statusDelta = Math.random() * 15 - 3
    const newMood = Math.max(0, Math.min(100, show.audienceMood + moodDelta))
    const newStatus = Math.max(0, Math.min(100, show.modelStatus + statusDelta))
    const shouldEvent = Math.random() < 0.25
    const events = [...show.events]
    if (shouldEvent) {
      const eventTypes = [
        { type: "wardrobe_malfunction" as const, description: "服装开裂！", impact: -0.15 },
        { type: "model_nervous" as const, description: "模特紧张！", impact: -0.1 },
        { type: "audience_boom" as const, description: "观众沸腾！", impact: 0.12 },
        { type: "judge_favor" as const, description: "评委青睐！", impact: 0.18 },
      ]
      const evt = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      events.push({ ...evt, timestamp: Date.now() })
    }
    return {
      fashionShows: state.fashionShows.map((s) =>
        s.id === showId ? { ...s, audienceMood: newMood, modelStatus: newStatus, events } : s
      ),
    }
  }),

  useShowSkill: (showId, skillType) => set((state) => {
    const show = state.fashionShows.find((s) => s.id === showId)
    if (!show) return state
    if (skillType === "calm") {
      return {
        fashionShows: state.fashionShows.map((s) =>
          s.id === showId ? { ...s, modelStatus: Math.min(100, s.modelStatus + 20) } : s
        ),
      }
    }
    return {
      fashionShows: state.fashionShows.map((s) =>
        s.id === showId ? { ...s, audienceMood: Math.min(100, s.audienceMood + 15) } : s
      ),
    }
  }),

  settleShow: (showId, result) => set((state) => {
    const show = state.fashionShows.find((s) => s.id === showId)
    if (!show || show.completed) return state

    let coinsEarned = 0
    let fameEarned = 0
    const newMaterials = { ...state.studio.materials }
    const rewards: ShowReward[] = []

    if (result.win) {
      coinsEarned = 500 + Math.floor(Math.random() * 500)
      fameEarned = 50 + Math.floor(Math.random() * 100)
      rewards.push({ type: "coins", name: "金币", value: coinsEarned })
      rewards.push({ type: "fame", name: "声望", value: fameEarned })

      const rareFabricChance = Math.random()
      if (rareFabricChance < 0.3) {
        const fabricNames = ["星河缎", "光纤维", "霓虹丝", "墨韵绸"]
        const fabricName = fabricNames[Math.floor(Math.random() * fabricNames.length)]
        const fabricKey = fabricName === "星河缎" ? "crystal" : fabricName === "光纤维" ? "neonThread" : fabricName === "霓虹丝" ? "neonThread" : "silk"
        newMaterials[fabricKey] = (newMaterials[fabricKey] || 0) + 3
        rewards.push({ type: "fabric", name: fabricName, value: 3, rarity: 4 })
      }
      if (rareFabricChance < 0.15) {
        rewards.push({ type: "blueprint", name: "稀有设计图纸", value: 1, rarity: 5 })
      }
    } else {
      coinsEarned = 100 + Math.floor(Math.random() * 200)
      fameEarned = 10 + Math.floor(Math.random() * 30)
      rewards.push({ type: "coins", name: "金币", value: coinsEarned })
      rewards.push({ type: "fame", name: "声望", value: fameEarned })
    }

    return {
      fashionShows: state.fashionShows.map((s) =>
        s.id === showId
          ? {
              ...s,
              completed: true,
              playerScore: result.finalScore,
              opponentScore: result.opponentScore,
              fashionIndexScore: result.fashionIndexScore,
              audienceVoteScore: result.audienceVoteScore,
              judgeScore: result.judgeScore,
              rewards,
            }
          : s
      ),
      studio: {
        ...state.studio,
        coins: state.studio.coins + coinsEarned,
        fame: state.studio.fame + fameEarned,
        materials: newMaterials,
      },
    }
  }),

  purchaseMarketItem: (itemId) => {
    const state = get()
    const item = state.marketItems.find((m) => m.id === itemId)
    if (!item || item.completed) return false
    if (state.studio.coins < item.price) return false

    const styleStyles: StyleType[] = ["ancient", "cyber", "nature"]
    const trendStyle = styleStyles[Math.floor(Math.random() * styleStyles.length)]
    const shouldTriggerTrend = Math.random() < 0.2

    set((state) => {
      const updates: Partial<GameState> = {
        marketItems: state.marketItems.map((m) =>
          m.id === itemId ? { ...m, completed: true, buyerId: state.studio.id } : m
        ),
        transactions: [...state.transactions, { ...item, completed: true, buyerId: state.studio.id }],
        studio: { ...state.studio, coins: state.studio.coins - item.price },
      }

      if (shouldTriggerTrend) {
        const styleLabels: Record<StyleType, string> = { ancient: "古风", cyber: "赛博", nature: "自然" }
        const trendNames: Record<StyleType, string[]> = {
          ancient: ["古风复兴", "东方绮梦", "水墨新风"],
          cyber: ["赛博风暴", "霓虹浪潮", "未来觉醒"],
          nature: ["自然之声", "绿野回响", "生态美学"],
        }
        const names = trendNames[trendStyle]
        const name = names[Math.floor(Math.random() * names.length)]
        const event: TrendEvent = {
          id: `te-${Date.now()}`,
          name,
          style: trendStyle,
          description: `全服${styleLabels[trendStyle]}风格服装热度提升25%`,
          multiplier: 1.25,
          timestamp: Date.now(),
        }
        updates.trendEvents = [event, ...state.trendEvents]
        updates.activities = [{
          id: `act-${Date.now()}`,
          message: `🎨 潮流风向：${name} — ${event.description}`,
          type: "trade" as const,
          timestamp: Date.now(),
        }, ...state.activities].slice(0, 50)
      }

      return updates
    })
    return true
  },

  addTrendEvent: (event) => set((state) => ({
    trendEvents: [event, ...state.trendEvents],
  })),

  getSuggestedPrice: (itemType, quality) => {
    const state = get()
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const recentPrices = state.transactions
      .filter((t) => t.completed && t.itemType === itemType && t.timestamp >= sevenDaysAgo)
      .map((t) => t.price)

    if (quality) {
      const qualityPrices = state.transactions
        .filter((t) => t.completed && t.itemType === itemType && t.quality === quality && t.timestamp >= sevenDaysAgo)
        .map((t) => t.price)
      if (qualityPrices.length > 0) {
        return suggestPriceRange(qualityPrices)
      }
    }

    if (recentPrices.length > 0) {
      return suggestPriceRange(recentPrices)
    }

    const basePrice: Record<string, number> = { clothing: 2000, blueprint: 1000 }
    const qualityMult: Record<Quality, number> = { common: 0.6, fine: 1, epic: 1.8, legendary: 3.5 }
    const base = basePrice[itemType] || 1500
    const mult = quality ? qualityMult[quality] : 1
    const avg = Math.round(base * mult)
    return { min: Math.round(avg * 0.7), max: Math.round(avg * 1.3), avg }
  },
}))

function rollAffixs(probs: Record<string, number>): AffixType[] {
  const affixes: AffixType[] = []
  for (const [affix, prob] of Object.entries(probs)) {
    if (Math.random() < prob) affixes.push(affix as AffixType)
  }
  return affixes
}
