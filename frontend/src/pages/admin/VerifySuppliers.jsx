import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import api from '../../utils/api'

export default function VerifySuppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPendingSuppliers()
  }, [])

  const fetchPendingSuppliers = async () => {
    try {
      const response = await api.get('/users/admin/all/')
      const all = response.data.results || response.data
      setSuppliers(all.filter(u => u.role === 'supplier' && u.status === 'pending'))
    } catch (err) {
      console.error('Failed to fetch suppliers', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (userId, action) => {
    try {
      const response = await api.post(`/users/admin/verify/${userId}/`, { action })
      alert(response.data.message)
      fetchPendingSuppliers()
    } catch (err) {
      console.error('Action failed', err)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={styles.title}>Verify Suppliers</h1>
      </div>

      {loading ? (
        <p>Loading pending suppliers...</p>
      ) : suppliers.length === 0 ? (
        <div style={styles.empty}>
          <CheckCircle size={48} color="#10b981" />
          <p>No pending supplier verifications. All caught up!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {suppliers.map((supplier) => (
            <div key={supplier.id} style={styles.card}>
              <div style={styles.cardInfo}>
                <h3 style={styles.name}>{supplier.full_name}</h3>
                <p style={styles.detail}>{supplier.email}</p>
                <p style={styles.detail}>{supplier.phone}</p>
                {supplier.business_name && (
                  <p style={styles.business}>Business: {supplier.business_name}</p>
                )}
                {supplier.business_location && (
                  <p style={styles.detail}>Location: {supplier.business_location}</p>
                )}
                <p style={styles.date}>
                  Registered: {new Date(supplier.date_joined).toLocaleDateString()}
                </p>
              </div>
              <div style={styles.cardActions}>
                <button
                  style={styles.approveBtn}
                  onClick={() => handleAction(supplier.id, 'approve')}
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  style={styles.rejectBtn}
                  onClick={() => handleAction(supplier.id, 'reject')}
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  title: { color: '#1a1a2e' },
  empty: { textAlign: 'center', padding: '3rem', color: '#999', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flex: 1 },
  name: { color: '#1a1a2e', marginBottom: '0.25rem' },
  detail: { color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' },
  business: { color: '#1a1a2e', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' },
  date: { color: '#999', fontSize: '0.8rem', marginTop: '0.5rem' },
  cardActions: { display: 'flex', gap: '0.75rem' },
  approveBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  rejectBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
}