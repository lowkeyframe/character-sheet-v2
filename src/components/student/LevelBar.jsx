import config from '../../data/config.json'

export default function LevelBar({ score, title }) {
  const tiers = config.globalTitles
  const currentTier = tiers.find(t => score >= t.minScore && score <= t.maxScore) || tiers[0]
  const isMaxTier = currentTier === tiers[tiers.length - 1]
  const tierSpan = currentTier.maxScore - currentTier.minScore
  const progress = isMaxTier
    ? 100
    : Math.min(100, Math.round(((score - currentTier.minScore) / tierSpan) * 100))

  return (
    <div className="level-bar">
      <div className="level-bar-header">
        <span className="level-title">{title}</span>
        <span className="level-score">{score} pts</span>
      </div>
      <div className="level-bar-track">
        <div className="level-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
