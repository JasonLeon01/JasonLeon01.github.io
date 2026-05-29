import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import LudorkApp from './Ludork/LudorkApp.tsx'

function Root() {
  // Ludork is accessed directly via URL — no links from the main page.
  // Browser back/forward between / and /Ludork triggers a full page load.
  if (window.location.pathname.startsWith('/Ludork')) {
    return <LudorkApp />
  }
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
