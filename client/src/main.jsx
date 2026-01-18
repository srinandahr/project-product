import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Navbar from './components/Navbar'
import "./index.css"
import AddJob from './pages/AddJob'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <AddJob />
  </StrictMode>,
)
