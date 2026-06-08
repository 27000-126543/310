import type { StyleType, Quality, AffixType, Fabric, ColorOption, Accessory, Staff, Facility } from "@/types"

const STYLE_MULTIPLIERS: Record<StyleType, Record<StyleType, number>> = {
  ancient: { ancient: 1.5, cyber: 0.8, nature: 1.2 },
  cyber: { ancient: 0.8, cyber: 1.5, nature: 1.0 },
  nature: { ancient: 1.2, cyber: 1.0, nature: 1.5 },
}

export function calculateFashionIndex(
  fabric: Fabric,
  color: ColorOption,
  accessories: Accessory[],
  studioStyle: StyleType,
  designerSkill: number
): number {
  const baseScore = fabric.bonus + color.harmonyScore * 10 + accessories.reduce((sum, a) => sum + a.bonus, 0)
  const styleBonus = accessories.reduce((mult, a) => {
    return mult * (a.styleAffinity.includes(studioStyle) ? 1.15 : 1.0)
  }, STYLE_MULTIPLIERS[studioStyle][fabric.styleAffinity[0] || studioStyle])
  const designerBonus = 1 + designerSkill * 0.05
  return Math.round(baseScore * styleBonus * designerBonus)
}

export function calculateAffixProbability(fashionIndex: number, fabricRarity: number): Record<AffixType, number> {
  const base = Math.min(fashionIndex / 1000, 0.35)
  const rarityMod = 1 + fabricRarity * 0.1
  const finalBase = Math.min(base * rarityMod, 0.35)
  return {
    luminous: Math.min(finalBase * 0.5, 0.18),
    starry: Math.min(finalBase * 0.35, 0.12),
    phantom: Math.min(finalBase * 0.2, 0.08),
    aurora: Math.min(finalBase * 0.12, 0.05),
    void: Math.min(finalBase * 0.05, 0.02),
  }
}

export function rollAffixes(probabilities: Record<AffixType, number>): AffixType[] {
  const affixes: AffixType[] = []
  for (const [affix, prob] of Object.entries(probabilities)) {
    if (Math.random() < prob) {
      affixes.push(affix as AffixType)
    }
  }
  return affixes
}

export function calculateCraftSuccessRate(tailorSkill: number, facilityLevel: number): number {
  const base = 0.5
  const tailorBonus = tailorSkill * 0.03
  const facilityBonus = facilityLevel * 0.05
  return Math.min(base + tailorBonus + facilityBonus, 0.95)
}

export function rollCraft(successRate: number): boolean {
  return Math.random() < successRate
}

export function determineQuality(fashionIndex: number): Quality {
  const roll = Math.random() * fashionIndex
  if (roll > 900) return "legendary"
  if (roll > 600) return "epic"
  if (roll > 300) return "fine"
  return "common"
}

export function calculateScoreCap(quality: Quality): number {
  const caps: Record<Quality, number> = {
    common: 60,
    fine: 75,
    epic: 90,
    legendary: 100,
  }
  return caps[quality]
}

export function calculateTeamPower(staff: Staff[]): number {
  return staff.reduce((total, s) => total + s.skillLevel * 10 + s.loyalty * 2, 0)
}

export function calculateFacilityBonus(facilities: Facility[]): number {
  return facilities.reduce((total, f) => total + f.level * f.bonusRate, 0)
}

export function calculateShowScore(
  fashionIndex: number,
  audienceVote: number,
  judgeScore: number,
  eventImpact: number,
  skillEffect: number
): number {
  const base = fashionIndex * 0.4 + audienceVote * 0.3 + judgeScore * 0.3
  return Math.round(base * (1 + eventImpact) * (1 + skillEffect))
}

export function suggestPriceRange(recentPrices: number[]): { min: number; max: number; avg: number } {
  if (recentPrices.length === 0) return { min: 100, max: 500, avg: 300 }
  const avg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length
  const min = Math.round(avg * 0.7)
  const max = Math.round(avg * 1.3)
  return { min, max, avg: Math.round(avg) }
}
