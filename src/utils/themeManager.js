export const THEMES = ['dark-minimal', 'parchment', 'cyber']
export const DEFAULT_THEME = 'dark-minimal'

export function applyTheme(themeName) {
  const theme = THEMES.includes(themeName) ? themeName : DEFAULT_THEME
  document.body.dataset.theme = theme
}
