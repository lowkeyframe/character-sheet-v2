import { useMemo, useState } from 'react'
import skillsData from '../../data/skills.json'

function SkillRow({ skill, maxScore }) {
  const pct = maxScore > 0 ? Math.round((skill.score / maxScore) * 100) : 0
  return (
    <div className="skill-row">
      <span className="skill-icon">{skill.icon}</span>
      <span className="skill-label">{skill.label}</span>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="skill-score">{skill.score}</span>
    </div>
  )
}

export default function SkillPanel({ skillScores }) {
  const [expanded, setExpanded] = useState(false)

  const allSkills = useMemo(() => {
    return Object.values(skillsData)
      .map(s => ({ ...s, score: skillScores[s.id] || 0 }))
      .sort((a, b) => b.score - a.score)
  }, [skillScores])

  const top4 = allSkills.slice(0, 4)
  const rest = allSkills.slice(4)
  const maxScore = allSkills[0]?.score || 0

  return (
    <div className="skill-panel">
      {top4.map(skill => (
        <SkillRow key={skill.id} skill={skill} maxScore={maxScore} />
      ))}

      {rest.length > 0 && (
        <div className="skill-accordion">
          <button
            type="button"
            className="accordion-toggle"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Masquer les autres compétences' : `Voir les ${rest.length} autres compétences`}
          </button>
          {expanded && (
            <div className="skill-accordion-content">
              {rest.map(skill => (
                <SkillRow key={skill.id} skill={skill} maxScore={maxScore} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
