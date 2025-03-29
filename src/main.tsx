import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Intro from './Page/Intro.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Intro />
    {/* <App /> */}
  </StrictMode>,
)
