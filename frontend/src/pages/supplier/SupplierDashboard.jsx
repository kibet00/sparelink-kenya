import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SupplierDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>SpareLink</h2>
        <nav>
          <p style={styles.navItem}>📦 My Products</p>
          <p style={styles.navItem}>➕ Add Product</p>
          <p style={styles.navItem}>🛒 Orders</p>
          <p style={styles.navItem}>💬 Messages</p>
          <p style={styles.navItem}>👤 Profile</p>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.welcome}>Welcome, {user?.fullName}! 🏪</h1>
          <p style={styles.subtitle}>Manage your spare parts inventory</p>
          {user?.status === 'pending' && (
            <div style={styles.pendingBanner}>
              ⚠️ Your account is pending admin verification. You cannot list products yet.
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>📦 Products</h3>
            <p style={styles.cardNumber}>0</p>
            <p>Listed products</p>
          </div>
          <div style={styles.card}>
            <h3>🛒 Orders</h3>
            <p style={styles.cardNumber}>0</p>
            <p>Pending orders</p>
          </div>
          <div style={styles.card}>
            <h3>💬 Messages</h3>
            <p style={styles.cardNumber}>0</p>
            <p>Unread messages</p>
          </div>
          <div style={styles.card}>
            <h3>⭐ Rating</h3>
            <p style={styles.cardNumber}>-</p>
            <p>Average rating</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.actions}>
          <h2>Quick Actions</h2>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn}>➕ Add Product</button>
            <button style={styles.actionBtn}>📦 View Inventory</button>
            <button style={styles.actionBtn}>🛒 View Orders</button>
            <button style={styles.actionBtn}>💬 Messages</button>
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
  navItem: { padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '6px', marginBottom: '0.5rem' },
  logoutBtn: { marginTop: 'auto', padding: '0.75rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
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