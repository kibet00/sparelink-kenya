import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
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
        <p style={styles.adminBadge}>Admin Panel</p>
        <nav>
          <p style={styles.navItem}>Dashboard</p>
          <p style={styles.navItem}>Users</p>
          <p style={styles.navItem}>Verify Suppliers</p>
          <p style={styles.navItem}>Products</p>
          <p style={styles.navItem}>Orders</p>
          <p style={styles.navItem}>Payments</p>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.welcome}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {user?.fullName} </p><p>Manage the SpareLink platform</p>
        </div>

        {/* Stats Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Users</h3>
            <p style={styles.cardNumber}>0</p>
            <p>Registered users</p>
          </div>
          <div style={styles.card}>
            <h3>Suppliers</h3>
            <p style={styles.cardNumber}>0</p>
            <p>Verified suppliers</p>
          </div>
          <div style={styles.card}>
            <h3>Pending</h3>
            <p style={styles.cardNumber}>0</p>
            <p>Awaiting verification</p>
          </div>
          <div style={styles.card}>
            <h3>Products</h3>
            <p style={styles.cardNumber}>0</p>
            <p>Listed products</p>
          </div>
          <div style={styles.card}>
            <h3>Orders</h3>
            <p style={styles.cardNumber}>0</p>
            <p>Total orders</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.actions}>
          <h2>Quick Actions</h2>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn}> Verify Suppliers</button>
            <button style={styles.actionBtn}> Manage Users</button>
            <button style={styles.actionBtn}> View Products</button>
            <button style={styles.actionBtn}> View Orders</button>
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
  navItem: { padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '6px', marginBottom: '0.5rem' },
  logoutBtn: { marginTop: 'auto', padding: '0.75rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
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