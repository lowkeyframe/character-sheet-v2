export function resolveGlobalTitle(score, config) {
  const tiers = config?.globalTitles || []
  const match = tiers.find(tier => score >= tier.minScore && score <= tier.maxScore)
  return match ? match.title : ''
}
