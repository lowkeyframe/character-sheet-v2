import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/base.css'
import '../styles/layout.css'
import '../styles/components.css'
import '../styles/admin.css'
import '../styles/animations.css'
import '../styles/themes/dark-minimal.css'
import '../styles/themes/parchment.css'
import '../styles/themes/cyber.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
