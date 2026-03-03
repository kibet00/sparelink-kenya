import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, ShieldCheck, Package, ShoppingCart, CreditCard, LogOut } from 'lucide-react'
import api from '../../utils/api'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0, verifiedSuppliers: 0,
    pendingSuppliers: 0, totalProducts: 0, totalOrders: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get('/users/admin/all/'),
          api.get('/products/'),
          api.get('/orders/my-orders/'),
        ])
        const users = usersRes.data.results || usersRes.data
        const products = productsRes.data.results || productsRes.data
        const orders = ordersRes.data.results || ordersRes.data
        setStats({
          totalUsers: users.length,
          verifiedSuppliers: users.filter(u => u.role === 'supplier' && u.status === 'active').length,
          pendingSuppliers: users.filter(u => u.role === 'supplier' && u.status === 'pending').length,
          totalProducts: products.length,
          totalOrders: orders.length,
        })
      } catch (err) {
        console.error('Failed to fetch stats', err)
      }
    }
    fetchStats()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>SpareLink</h2>
        <span style={styles.adminBadge}>Admin Panel</span>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/admin/dashboard')}>
            <LayoutDashboard size={16} /> <span>Dashboard</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/admin/users')}>
            <Users size={16} /> <span>Users</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/admin/verify-suppliers')}>
            <ShieldCheck size={16} /> <span>Verify Suppliers</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/admin/products')}>
            <Package size={16} /> <span>Products</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/admin/orders')}>
            <ShoppingCart size={16} /> <span>Orders</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/admin/payments')}>
            <CreditCard size={16} /> <span>Payments</span>
          </div>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={16} /> <span>Logout</span>
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.welcome}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {user?.fullName} — manage the SpareLink platform</p>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <Users size={24} color="#c9a84c" />
            <p style={styles.cardNumber}>{stats.totalUsers}</p>
            <p>Registered Users</p>
          </div>
          <div style={styles.card}>
            <ShieldCheck size={24} color="#c9a84c" />
            <p style={styles.cardNumber}>{stats.verifiedSuppliers}</p>
            <p>Verified Suppliers</p>
          </div>
          <div style={styles.card}>
            <ShieldCheck size={24} color="#c9a84c" />
            <p style={styles.cardNumber}>{stats.pendingSuppliers}</p>
            <p>Awaiting Verification</p>
          </div>
          <div style={styles.card}>
            <Package size={24} color="#c9a84c" />
            <p style={styles.cardNumber}>{stats.totalProducts}</p>
            <p>Listed Products</p>
          </div>
          <div style={styles.card}>
            <ShoppingCart size={24} color="#c9a84c" />
            <p style={styles.cardNumber}>{stats.totalOrders}</p>
            <p>Total Orders</p>
          </div>
        </div>

        <div style={styles.actions}>
          <h2>Quick Actions</h2>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn} onClick={() => navigate('/admin/verify-suppliers')}>Verify Suppliers</button>
            <button style={styles.actionBtn} onClick={() => navigate('/admin/users')}>Manage Users</button>
            <button style={styles.actionBtn} onClick={() => navigate('/admin/products')}>View Products</button>
            <button style={styles.actionBtn} onClick={() => navigate('/admin/orders')}>View Orders</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' },
  sidebar: { width: '240px', background: '#1a1a2e', color: 'white', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' },
  logo: { color: '#c9a84c', marginBottom: '0.5rem', fontSize: '1.5rem' },
  adminBadge: { background: '#c9a84c', color: '#1a1a2e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2rem', display: 'inline-block' },
  nav: { flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '6px', marginBottom: '0.5rem' },
  logoutBtn: { padding: '0.75rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  main: { flex: 1, background: '#f5f5f5', padding: '2rem' },
  header: { marginBottom: '2rem' },
  welcome: { color: '#1a1a2e', marginBottom: '0.5rem' },
  subtitle: { color: '#666' },
  cards: { display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '8px', flex: '1', minWidth: '150px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' },
  cardNumber: { fontSize: '2.5rem', fontWeight: 'bold', color: '#c9a84c', margin: '0.5rem 0' },
  actions: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  actionButtons: { display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' },
  actionBtn: { padding: '0.75rem 1.5rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
}