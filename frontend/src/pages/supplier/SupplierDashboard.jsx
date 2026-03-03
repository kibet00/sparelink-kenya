import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Plus, ShoppingCart, MessageSquare, User, LogOut } from 'lucide-react'
import api from '../../utils/api'

export default function SupplierDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, unreadMessages: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, inboxRes] = await Promise.all([
          api.get('/products/supplier/my-listings/'),
          api.get('/orders/my-orders/'),
          api.get('/messages/inbox/'),
        ])
        const products = productsRes.data.results || productsRes.data
        const orders = ordersRes.data.results || ordersRes.data
        const inbox = inboxRes.data
        setStats({
          totalProducts: products.length,
          totalOrders: orders.filter(o => o.status === 'pending').length,
          unreadMessages: inbox.length,
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
        <nav>
          <div style={styles.navItem} onClick={() => navigate('/supplier/dashboard')}>
            <LayoutDashboard size={16} /> <span>Dashboard</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/supplier/products')}>
            <Package size={16} /> <span>My Products</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/supplier/add-product')}>
            <Plus size={16} /> <span>Add Product</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/supplier/orders')}>
            <ShoppingCart size={16} /> <span>Orders</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/supplier/messages')}>
            <MessageSquare size={16} /> <span>Messages</span>
          </div>
          <div style={styles.navItem} onClick={() => navigate('/supplier/profile')}>
            <User size={16} /> <span>Profile</span>
          </div>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={16} /> <span>Logout</span>
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.welcome}>Welcome, {user?.fullName}!</h1>
          <p style={styles.subtitle}>Manage your spare parts inventory</p>
          {user?.status === 'pending' && (
            <div style={styles.pendingBanner}>
              Your account is pending admin verification. You cannot list products yet.
            </div>
          )}
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <Package size={24} color="#c9a84c" />
            <p style={styles.cardNumber}>{stats.totalProducts}</p>
            <p>Listed Products</p>
          </div>
          <div style={styles.card}>
            <ShoppingCart size={24} color="#c9a84c" />
            <p style={styles.cardNumber}>{stats.totalOrders}</p>
            <p>Pending Orders</p>
          </div>
          <div style={styles.card}>
            <MessageSquare size={24} color="#c9a84c" />
            <p style={styles.cardNumber}>{stats.unreadMessages}</p>
            <p>Conversations</p>
          </div>
        </div>

        <div style={styles.actions}>
          <h2>Quick Actions</h2>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn} onClick={() => navigate('/supplier/add-product')}>Add Product</button>
            <button style={styles.actionBtn} onClick={() => navigate('/supplier/products')}>View Inventory</button>
            <button style={styles.actionBtn} onClick={() => navigate('/supplier/orders')}>View Orders</button>
            <button style={styles.actionBtn} onClick={() => navigate('/supplier/messages')}>Messages</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' },
  sidebar: { width: '240px', background: '#1a1a2e', color: 'white', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' },
  logo: { color: '#c9a84c', marginBottom: '2rem', fontSize: '1.5rem' },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '6px', marginBottom: '0.5rem' },
  logoutBtn: { marginTop: 'auto', padding: '0.75rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  main: { flex: 1, background: '#f5f5f5', padding: '2rem' },
  header: { marginBottom: '2rem' },
  welcome: { color: '#1a1a2e', marginBottom: '0.5rem' },
  subtitle: { color: '#666' },
  pendingBanner: { background: '#fff3cd', border: '1px solid #ffc107', padding: '1rem', borderRadius: '6px', marginTop: '1rem', color: '#856404' },
  cards: { display: 'flex', gap: '1.5rem', marginBottom: '2rem' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '8px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' },
  cardNumber: { fontSize: '2.5rem', fontWeight: 'bold', color: '#c9a84c', margin: '0.5rem 0' },
  actions: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  actionButtons: { display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' },
  actionBtn: { padding: '0.75rem 1.5rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
}