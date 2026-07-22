export function computeSkillScores(projects, endorsements) {
  const scores = {}
  const safeProjects = projects || []
  const safeEndorsements = endorsements || []

  for (const project of safeProjects) {
    const projectEndorsements = safeEndorsements.filter(e => e.project_id === project.id).length
    const projectValue = (project.skills || []).length
    const endorsementBoost = projectEndorsements * 10

    for (const skillId of (project.skills || [])) {
      scores[skillId] = (scores[skillId] || 0) + projectValue + endorsementBoost
    }
  }

  return scores
}

export function countUnlockedBadges(badges) {
  if (!badges) return 0
  return Object.values(badges).filter(b => b && b.unlocked).length
}

export function calculateGlobalScore(skillScores, badges) {
  const skillTotal = skillScores ? Object.values(skillScores).reduce((sum, score) => sum + score, 0) : 0
  return skillTotal + countUnlockedBadges(badges) * 100
}
