import { create } from "zustand"
import type { Studio, Staff, Design, CraftedItem, Facility, Transaction, FashionShow, TrendEvent, TodoItem, Activity, ApprovalRequest, Fabric, ColorOption, Accessory, AffixType } from "@/types"
import { MOCK_STUDIO, MOCK_STAFF, MOCK_CANDIDATES, MOCK_DESIGNS, MOCK_CRAFTED_ITEMS, MOCK_FACILITIES, MOCK_TRANSACTIONS, MOCK_MARKET_ITEMS, MOCK_FASHION_SHOWS, MOCK_TREND_EVENTS, MOCK_TODOS, MOCK_ACTIVITIES, MOCK_APPROVALS, MOCK_FABRICS, MOCK_COLORS, MOCK_ACCESSORIES } from "@/data/mock"
import { calculateTeamPower, calculateCraftSuccessRate, rollCraft, determineQuality, calculateScoreCap, calculateFashionIndex, calculateAffixProbability, rollAffixes } from "@/engine"

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
  craftItem: (designId: string) => { success: boolean; quality: string; scoreCap: number } | null
  completeTodo: (id: string) => void
  addActivity: (message: string, type: Activity["type"]) => void
  upgradeFacility: (facilityId: string) => void
  approveRequest: (id: string) => void
  rejectRequest: (id: string) => void
  listOnMarket: (itemId: string, price: number) => void
  runShowStep: (showId: string) => void
  useShowSkill: (showId: string, skillType: "calm" | "improvise") => void
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

  craftItem: (designId) => {
    const state = get()
    const design = state.designs.find((d) => d.id === designId)
    if (!design) return null
    const tailor = state.staff.find((s) => s.role === "tailor")
    const sewingMachine = state.facilities.find((f) => f.type === "sewingMachine")
    const successRate = calculateCraftSuccessRate(tailor?.skillLevel || 1, sewingMachine?.level || 1)
    const success = rollCraft(successRate)
    if (!success) {
      return { success: false, quality: "common", scoreCap: 0 }
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
    const listing: Transaction = {
      id: `t-${Date.now()}`,
      itemId: item.id,
      itemType: "clothing",
      itemName: item.designName,
      quality: item.quality,
      price,
      suggestedMin: Math.round(price * 0.7),
      suggestedMax: Math.round(price * 1.3),
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
}))

function rollAffixs(probs: Record<string, number>): AffixType[] {
  const affixes: AffixType[] = []
  for (const [affix, prob] of Object.entries(probs)) {
    if (Math.random() < prob) affixes.push(affix as AffixType)
  }
  return affixes
}
