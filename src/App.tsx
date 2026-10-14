import { HashRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './lib/cart'
import { Shell } from './components'
import Welcome from './pages/Welcome'
import Products from './pages/Products'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import Admin from './pages/Admin'

export default function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route element={<Shell />}>
            <Route index element={<Welcome />} />
            <Route path="produtos" element={<Products />} />
            <Route path="produto/:id" element={<ProductPage />} />
            <Route path="carrinho" element={<Cart />} />
          </Route>
        </Routes>
      </HashRouter>
    </CartProvider>
  )
}
