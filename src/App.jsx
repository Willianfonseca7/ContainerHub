import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import Home from '@/pages/Home'
import Kontainers from '@/pages/Kontainers'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="kontainers" element={<Kontainers />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
