import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api from '../../utils/api'

export default function SupplierOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.post(`/orders/${orderId}/status/`, { status: newStatus })
      fetchOrders()
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const statusColor = (status) => {
    const colors = {
      pending: '#f59e0b', confirmed: '#3b82f6',
      paid: '#8b5cf6', shipped: '#06b6d4',
      completed: '#10b981', cancelled: '#ef4444',
    }
    return colors[status] || '#666'
  }

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/supplier/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={styles.title}>Orders</h1>
      </div>

      <div style={styles.filters}>
        {['all', 'pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            style={filter === f ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div style={styles.empty}>No orders found.</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Buyer</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total (KES)</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={styles.tr}>
                  <td style={styles.td}>#{order.id}</td>
                  <td style={styles.td}>{order.buyer_name}</td>
                  <td style={styles.td}>
                    {order.items.map(item => (
                      <p key={item.id} style={styles.itemLine}>
                        {item.product_name} x{item.quantity}
                      </p>
                    ))}
                  </td>
                  <td style={styles.td}>{Number(order.total_amount).toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: statusColor(order.status), color: 'white' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      style={styles.select}
                    >
                      {['pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  title: { color: '#1a1a2e' },
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.4rem 0.75rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  filterActive: { padding: '0.4rem 0.75rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#999' },
  tableWrapper: { background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e', color: 'white' },
  th: { padding: '1rem', textAlign: 'left', fontSize: '0.85rem' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '1rem', fontSize: '0.9rem', color: '#444' },
  itemLine: { fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  select: { padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' },
}