import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from '@/views/App'
import Import from '@/views/Import'
import 'normalize.css'
import '@/index.scss'

async function init() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="import" element={<Import />} />
        </Routes>
      </Router>
    </React.StrictMode>
  )
}

init()
