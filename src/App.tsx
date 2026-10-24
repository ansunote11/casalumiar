import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './lib/cart'
import { captureUtm } from './lib/track'
import { Shell } from './components'
import Welcome from './pages/Welcome'
import Products from './pages/Products'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import About from './pages/About'
import Admin from './pages/Admin'

// Links antigos (com #, ex.: /#/produto/123) viram o endereço novo, sem recarregar.
if (window.location.hash.startsWith('#/')) window.history.replaceState(null, '', window.location.hash.slice(1))
captureUtm()

/** Cada página nova abre do topo (sem herdar a rolagem da página anterior). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route element={<Shell />}>
            <Route index element={<Welcome />} />
            <Route path="produtos" element={<Products />} />
            <Route path="produto/:slug" element={<ProductPage />} />
            <Route path="carrinho" element={<Cart />} />
            <Route path="sobre" element={<About />} />
            <Route path="*" element={<Welcome />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
