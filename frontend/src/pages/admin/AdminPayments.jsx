import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard } from 'lucide-react'
import api from '../../utils/api'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const ordersRes = await api.get('/orders/my-orders/')
      const orders = ordersRes.data.results || ordersRes.data
      const paymentData = orders
        .filter(o => o.payment)
        .map(o => ({ ...o.payment, order_id: o.id, buyer_name: o.buyer_name, total_amount: o.total_amount }))
      setPayments(paymentData)
      const paidTotal = paymentData
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0)
      setTotal(paidTotal)
    } catch (err) {
      console.error('Failed to fetch payments', err)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status) => {
    if (status === 'success') return { background: '#d1fae5', color: '#065f46' }
    if (status === 'pending') return { background: '#fef3c7', color: '#92400e' }
    return { background: '#fee2e2', color: '#991b1b' }
  }

  const filtered = payments.filter(p => filter === 'all' || p.status === filter)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={styles.title}>Payments</h1>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryCards}>
        <div style={styles.summaryCard}>
          <CreditCard size={24} color="#c9a84c" />
          <p style={styles.summaryNumber}>{payments.length}</p>
          <p style={styles.summaryLabel}>Total Transactions</p>
        </div>
        <div style={styles.summaryCard}>
          <CreditCard size={24} color="#10b981" />
          <p style={styles.summaryNumber}>{payments.filter(p => p.status === 'success').length}</p>
          <p style={styles.summaryLabel}>Successful Payments</p>
        </div>
        <div style={styles.summaryCard}>
          <CreditCard size={24} color="#f59e0b" />
          <p style={styles.summaryNumber}>{payments.filter(p => p.status === 'pending').length}</p>
          <p style={styles.summaryLabel}>Pending Payments</p>
        </div>
        <div style={styles.summaryCard}>
          <CreditCard size={24} color="#c9a84c" />
          <p style={styles.summaryNumber}>KES {total.toLocaleString()}</p>
          <p style={styles.summaryLabel}>Total Revenue</p>
        </div>
      </div>

      <div style={styles.filters}>
        {['all', 'success', 'pending', 'failed'].map(f => (
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
        <p>Loading payments...</p>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No payments found.</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Payment ID</th>
                <th style={styles.th}>Order</th>
                <th style={styles.th}>Buyer</th>
                <th style={styles.th}>M-Pesa Code</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Amount (KES)</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment.id} style={styles.tr}>
                  <td style={styles.td}>#{payment.id}</td>
                  <td style={styles.td}>#{payment.order_id}</td>
                  <td style={styles.td}>{payment.buyer_name}</td>
                  <td style={styles.td}>
                    <span style={styles.mpesaCode}>{payment.mpesa_code || '-'}</span>
                  </td>
                  <td style={styles.td}>{payment.phone}</td>
                  <td style={styles.td}>{Number(payment.amount).toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...statusColor(payment.status) }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : '-'}
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
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  title: { color: '#1a1a2e' },
  summaryCards: { display: 'flex', gap: '1.5rem', marginBottom: '2rem' },
  summaryCard: { background: 'white', padding: '1.5rem', borderRadius: '8px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' },
  summaryNumber: { fontSize: '1.75rem', fontWeight: 'bold', color: '#1a1a2e', margin: '0.5rem 0' },
  summaryLabel: { color: '#666', fontSize: '0.85rem' },
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  filterBtn: { padding: '0.4rem 0.75rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  filterActive: { padding: '0.4rem 0.75rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#999' },
  tableWrapper: { background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e', color: 'white' },
  th: { padding: '1rem', textAlign: 'left', fontSize: '0.85rem' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '1rem', fontSize: '0.9rem', color: '#444' },
  mpesaCode: { fontFamily: 'monospace', background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
}