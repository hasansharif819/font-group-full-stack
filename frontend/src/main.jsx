import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FontGroupManager from './App'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FontGroupManager />
  </StrictMode>,
)
