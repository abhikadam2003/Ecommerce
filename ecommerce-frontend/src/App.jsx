import { BrowserRouter, Routes, Route, Link, NavLink, Navigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CartProvider, useCart } from './state/CartContext.jsx'
import { AuthProvider, useAuth } from './state/AuthContext.jsx'
import { fetchProducts, fetchProductById, authenticate, addToCart as addToCartApi, getCart, removeFromCart as removeFromCartApi, createProduct } from './lib/api.js'

function Navbar() {
  const { user } = useAuth()
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('auth-user') || 'null') } catch { return null }
  })()
  const effectiveUser = user || storedUser
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="font-semibold tracking-tight">eCommerce</Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/products" className={({ isActive }) => isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}>
            Cart
          </NavLink>
          {effectiveUser?.role && effectiveUser.role.toLowerCase() === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}>
              Admin
            </NavLink>
          )}
          <AuthNavButton />
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-gray-500">
        © {new Date().getFullYear()} eCommerce. All rights reserved.
      </div>
    </footer>
  )
}

function Container({ children }) {
  return <div className="mx-auto max-w-7xl px-4">{children}</div>
}

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError('')
    fetchProducts()
      .then((data) => {
        if (!isMounted) return
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setProducts(list)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err?.response?.data?.message || 'Failed to load products')
      })
      .finally(() => isMounted && setLoading(false))
    return () => { isMounted = false }
  }, [])

  return (
    <Container>
      <h2 className="mb-6 mt-10 text-2xl font-semibold tracking-tight">Products</h2>
      {loading && (
        <div className="py-10 text-gray-500">Loading products…</div>
      )}
      {error && !loading && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link key={p._id || p.id} to={`/products/${p._id || p.id}`} className="group rounded-lg border border-gray-200 p-4 hover:shadow-sm">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                {p.image && (
                  <img src={p.image} alt={p.name} className="size-full object-cover" />
                )}
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  {p.category?.name && <p className="text-sm text-gray-500">{p.category.name}</p>}
                </div>
                <p className="font-semibold text-gray-900">${Number(p.price || 0).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  )
}

function ProductDetailPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError('')
    fetchProductById(id)
      .then((data) => {
        if (!isMounted) return
        const p = data?.data || data
        setProduct(p)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err?.response?.data?.message || 'Failed to load product')
      })
      .finally(() => isMounted && setLoading(false))
    return () => { isMounted = false }
  }, [id])

  if (loading) return <Container><div className="py-10 text-gray-500">Loading product…</div></Container>
  if (error) return <Container><div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div></Container>
  if (!product) return null

  const productId = product._id || product.id

  return (
    <Container>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 py-10 md:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
          {product.image && (
            <img src={product.image} alt={product.name} className="size-full object-cover" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          {product.description && <p className="mt-2 text-gray-600">{product.description}</p>}
          <p className="mt-4 text-2xl font-semibold">${Number(product.price || 0).toFixed(2)}</p>
          <button onClick={async () => {
            const token = localStorage.getItem('auth-token')
            if (token) {
              try {
                await addToCartApi(productId, 1)
              } catch {}
            }
            addItem({ id: productId, name: product.name, price: product.price, image: product.image })
          }} className="mt-6 w-full rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-black md:w-auto">Add to cart</button>
        </div>
      </div>
    </Container>
  )
}

function AuthNavButton() {
  const { user, setUser } = useAuth()
  function signOut() {
    localStorage.removeItem('auth-token')
    setUser(null)
  }
  if (user) {
    return (
      <button onClick={signOut} className="text-gray-600 hover:text-gray-900">Sign out</button>
    )
  }
  return (
    <NavLink to="/auth" className={({ isActive }) => isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}>
      Sign In
    </NavLink>
  )
}

function CartPage() {
  const { items, removeItem, replaceItems, subtotal } = useCart()
  const hasItems = items.length > 0

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) return
    getCart()
      .then((data) => {
        const raw = data?.data || []
        const mapped = raw.map((it) => ({
          id: it.product?._id || it.product,
          name: it.product?.name || 'Product',
          price: it.priceSnapshot ?? it.product?.price ?? 0,
          image: it.product?.image,
          quantity: it.quantity || 1,
        }))
        replaceItems(mapped)
      })
      .catch(() => {})
  }, [replaceItems])

  return (
    <Container>
      <h2 className="mb-6 mt-10 text-2xl font-semibold tracking-tight">Your cart</h2>
      {!hasItems ? (
        <div className="rounded-md border border-gray-200 p-6 text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="size-16 overflow-hidden rounded bg-gray-100">
                    {i.image && <img src={i.image} alt={i.name} className="size-full object-cover" />}
                  </div>
                  <div>
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-gray-500">${Number(i.price || 0).toFixed(2)} × {i.quantity}</p>
                  </div>
                </div>
                <button onClick={async () => {
                  const token = localStorage.getItem('auth-token')
                  if (token) {
                    try { await removeFromCartApi(i.id) } catch {}
                  }
                  removeItem(i.id)
                }} className="text-sm text-gray-600 hover:text-gray-900">Remove</button>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="mt-4 w-full rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-black">Checkout</button>
          </div>
        </div>
      )}
    </Container>
  )
}

function AuthPage() {
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await authenticate({ email, password })
      const token = data?.token || data?.data?.token
      if (token) {
        localStorage.setItem('auth-token', token)
        const nextUser = data?.data || null
        setUser(nextUser)
        try { if (nextUser) localStorage.setItem('auth-user', JSON.stringify(nextUser)) } catch {}
        const role = (nextUser?.role || '').toLowerCase()
        window.location.replace(role === 'admin' ? '/admin' : '/')
      } else {
        setError('Unexpected response from server')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-sm py-10">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Sign in</h2>
        {error && <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200" />
          </div>
          <button disabled={loading} className="w-full rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-black disabled:opacity-60">{loading ? 'Signing in…' : 'Continue'}</button>
        </form>
      </div>
    </Container>
  )
}

function ProtectedRoute({ element, role }) {
  const { user, loading } = useAuth()
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('auth-user') || 'null') } catch { return null }
  })()
  const effectiveUser = user || storedUser
  const hasToken = !!localStorage.getItem('auth-token')

  if (loading) return <div className="p-6 text-gray-500">Checking permissions…</div>
  // If we have a token but user not yet loaded, allow access to avoid flicker
  if (!effectiveUser && hasToken) return element
  if (!effectiveUser) return <Navigate to="/auth" replace />
  if (role && (effectiveUser.role || '').toLowerCase() !== role.toLowerCase()) return <Navigate to="/" replace />
  return element
}

function AdminPage() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const payload = { name, price: Number(price), image, description }
      const res = await createProduct(payload)
      if (res?.success) {
        setSuccess('Product created')
        setName(''); setPrice(''); setImage(''); setDescription('')
      } else {
        setError(res?.message || 'Failed to create product')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <div className="py-10">
        <h2 className="text-2xl font-semibold tracking-tight">Add product</h2>
        {error && <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mt-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}
        <form className="mt-6 grid max-w-xl gap-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Price</label>
            <input value={price} onChange={(e)=>setPrice(e.target.value)} type="number" min="0" step="0.01" required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Image URL</label>
            <input value={image} onChange={(e)=>setImage(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Description</label>
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows="3" className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200" />
          </div>
          <button disabled={loading} className="w-full rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-black disabled:opacity-60">{loading ? 'Saving…' : 'Create product'}</button>
        </form>
      </div>
    </Container>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<ProtectedRoute role="admin" element={<AdminPage />} />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
