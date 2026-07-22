import { THEMES } from '../../utils/themeManager'

const THEME_LABELS = {
  'dark-minimal': 'Sombre',
  parchment: 'Parchemin',
  cyber: 'Cyber',
}

export default function ThemeSwitcher({ currentTheme, onChange }) {
  return (
    <div className="theme-switcher">
      {THEMES.map(theme => (
        <button
          key={theme}
          type="button"
          className={`theme-btn ${theme === currentTheme ? 'active' : ''}`}
          onClick={() => onChange(theme)}
        >
          {THEME_LABELS[theme] || theme}
        </button>
      ))}
    </div>
  )
}
