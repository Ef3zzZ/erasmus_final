import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { WeatherProvider } from './context/WeatherContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </LanguageProvider>
  </StrictMode>,
)

