/// <reference types="vite/client" />

import React from 'react'
import ReactDOM from 'react-dom/client'
import GuidePage from './pages/guide'
import { initAnalytics } from './lib/analytics'
import './index.css'

initAnalytics()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GuidePage />
  </React.StrictMode>,
)
