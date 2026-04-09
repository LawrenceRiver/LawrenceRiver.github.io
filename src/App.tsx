import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Shell from '@/components/Shell'
import Home from '@/pages/Home'
import Singer from '@/pages/Singer'
import Research from '@/pages/Research'
import ItemDetail from '@/pages/ItemDetail'
import { I18nProvider } from '@/i18n'

export default function App() {
  return (
    <I18nProvider>
      <Router>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Home />} />
            <Route path="/singer" element={<Singer />} />
            <Route path="/research" element={<Research />} />
            <Route path="/item/:type/:slug" element={<ItemDetail />} />
          </Route>
        </Routes>
      </Router>
    </I18nProvider>
  )
}
