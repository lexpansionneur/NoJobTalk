import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Accueil } from './pages/Accueil'
import { Carte } from './pages/Carte'
import { Discussion } from './pages/Discussion'
import { Liens } from './pages/Liens'
import { Profil } from './pages/Profil'
import { Tables } from './pages/Tables'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Accueil />} />
        <Route path="carte" element={<Carte />} />
        <Route path="tables" element={<Tables />} />
        <Route path="discussion" element={<Discussion />} />
        <Route path="liens" element={<Liens />} />
        <Route path="profil" element={<Profil />} />
      </Route>
    </Routes>
  )
}

export default App
