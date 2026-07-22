import { useMemo } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import skillsData from '../../data/skills.json'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

export default function RadarChart({ skillScores, theme }) {
  const topSkills = useMemo(() => {
    return Object.entries(skillScores || {})
      .map(([id, score]) => ({ id, score, label: skillsData[id]?.label || id }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }, [skillScores])

  const isDark = theme !== 'parchment'
  const textColor = isDark ? '#a1a1aa' : '#6b5c53'
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  if (topSkills.length === 0) {
    return <p className="radar-empty">Ajoutez des projets pour voir apparaître votre profil de compétences.</p>
  }

  const data = {
    labels: topSkills.map(s => s.label),
    datasets: [
      {
        label: 'Score',
        data: topSkills.map(s => s.score),
        backgroundColor: 'rgba(139, 92, 246, 0.25)',
        borderColor: 'rgba(139, 92, 246, 0.9)',
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        angleLines: { color: gridColor },
        grid: { color: gridColor },
        pointLabels: { color: textColor, font: { size: 12 } },
        ticks: { display: false },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="radar-chart-wrapper">
      <Radar data={data} options={options} />
    </div>
  )
}
