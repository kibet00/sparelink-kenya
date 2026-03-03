import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ArrowLeft } from 'lucide-react'
import api from '../../utils/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders/')
        setOrders(response.data.results || response.data)
      } catch (err) {
        console.error('Failed to fetch orders', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const statusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      paid: '#8b5cf6',
      shipped: '#06b6d4',
      completed: '#10b981',
      cancelled: '#ef4444',
    }
    return colors[status] || '#666'
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/buyer/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={styles.title}>My Orders</h1>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div style={styles.empty}>
          <Package size={48} color="#ccc" />
          <p>No orders yet. Start by browsing spare parts!</p>
          <button style={styles.browseBtn} onClick={() => navigate('/buyer/products')}>
            Browse Parts
          </button>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <h3>Order #{order.id}</h3>
                <span style={{ ...styles.status, background: statusColor(order.status) }}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div style={styles.orderItems}>
                {order.items.map((item) => (
                  <p key={item.id} style={styles.orderItem}>
                    {item.product_name} x{item.quantity} — KES {Number(item.subtotal).toLocaleString()}
                  </p>
                ))}
              </div>
              <div style={styles.orderFooter}>
                <p style={styles.total}>Total: KES {Number(order.total_amount).toLocaleString()}</p>
                <p style={styles.date}>{new Date(order.created_at).toLocaleDateString()}</p>
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
  empty: { textAlign: 'center', padding: '3rem', color: '#999' },
  browseBtn: { marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  orderCard: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  status: { padding: '0.25rem 0.75rem', borderRadius: '20px', color: 'white', fontSize: '0.75rem', fontWeight: 'bold' },
  orderItems: { borderTop: '1px solid #f0f0f0', paddingTop: '1rem', marginBottom: '1rem' },
  orderItem: { color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' },
  total: { fontWeight: 'bold', color: '#c9a84c' },
  date: { color: '#999', fontSize: '0.85rem' },
}