import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Vibe from './Vibe.jsx'
import City from './City.jsx'
import Mood from './Mood.jsx'
import Alerts from './Alerts.jsx'
import Trend from './Trend.jsx'
import Events from './Events.jsx'
import Insight from './Insight.jsx'
import User from './User.jsx'
import About from './About.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing / Home */}
        <Route path="/" element={<App />} />
        {/* City Vibe Explorer */}
        <Route path="/vibe" element={<Vibe />} />
        {/* City Details */}
        <Route path="/city/:city_name" element={<City />} />
        {/* Mood Feed */}
        <Route path="/mood" element={<Mood />} />
        {/* Alerts */}
        <Route path="/alerts" element={<Alerts />} />
        {/* Trend */}
        <Route path="/trend/:city_name" element={<Trend />} />
        {/* Events */}
        <Route path="/events" element={<Events />} />
        {/* Insights */}
        <Route path="/insight" element={<Insight />} />
        {/* User Profile */}
        <Route path="/user" element={<User />} />
        {/* About */}
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
