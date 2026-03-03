import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react'
import api from '../../utils/api'

export default function Payment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [mpesaCode, setMpesaCode] = useState('')
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}/`)
        setOrder(response.data)
        if (response.data.status === 'paid') setPaid(true)
      } catch (err) {
        console.error('Failed to fetch order', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  const handlePayment = async (e) => {
    e.preventDefault()
    setPaying(true)
    setError('')
    try {
      const response = await api.post(`/payments/${orderId}/pay/`, {
        phone,
        mpesa_code: mpesaCode,
      })
      if (mpesaCode) {
        setPaid(true)
      } else {
        alert(response.data.message)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return <div style={styles.loading}>Loading order...</div>
  if (!order) return <div style={styles.loading}>Order not found.</div>

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/buyer/orders')} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div style={styles.layout}>
        {/* Order Summary */}
        <div style={styles.summaryCard}>
          <h2 style={styles.cardTitle}>Order Summary</h2>
          <p style={styles.orderId}>Order #{order.id}</p>

          <div style={styles.itemsList}>
            {order.items.map((item) => (
              <div key={item.id} style={styles.item}>
                <span>{item.product_name} x{item.quantity}</span>
                <span>KES {Number(item.subtotal).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total Amount</span>
            <span style={styles.totalAmount}>
              KES {Number(order.total_amount).toLocaleString()}
            </span>
          </div>

          <div style={styles.statusRow}>
            <span>Payment Status</span>
            <span style={paid ? styles.paidBadge : styles.pendingBadge}>
              {paid ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Payment Form */}
        <div style={styles.paymentCard}>
          {paid ? (
            <div style={styles.successSection}>
              <CheckCircle size={64} color="#10b981" />
              <h2 style={styles.successTitle}>Payment Confirmed!</h2>
              <p style={styles.successText}>
                Your order has been paid and is now being processed.
              </p>
              <button
                style={styles.ordersBtn}
                onClick={() => navigate('/buyer/orders')}
              >
                View My Orders
              </button>
            </div>
          ) : (
            <>
              <div style={styles.paymentHeader}>
                <CreditCard size={24} color="#c9a84c" />
                <h2 style={styles.cardTitle}>Pay with M-Pesa</h2>
              </div>

              <div style={styles.mpesaInstructions}>
                <p style={styles.instructionTitle}>How to pay:</p>
                <ol style={styles.instructionList}>
                  <li>Go to M-Pesa on your phone</li>
                  <li>Select <strong>Lipa na M-Pesa</strong></li>
                  <li>Select <strong>Pay Bill</strong></li>
                  <li>Enter Business No: <strong>247247</strong></li>
                  <li>Enter Amount: <strong>KES {Number(order.total_amount).toLocaleString()}</strong></li>
                  <li>Enter your M-Pesa PIN and confirm</li>
                  <li>Enter the confirmation code below</li>
                </ol>
              </div>

              {error && <p style={styles.error}>{error}</p>}

              <form onSubmit={handlePayment}>
                <div style={styles.field}>
                  <label style={styles.label}>Your M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0712345678"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>M-Pesa Confirmation Code</label>
                  <input
                    type="text"
                    value={mpesaCode}
                    onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                    placeholder="e.g. QHX4EXAMPLE"
                    style={styles.input}
                    required
                  />
                  <p style={styles.hint}>
                    Enter the code from your M-Pesa confirmation SMS
                  </p>
                </div>

                <button
                  type="submit"
                  style={styles.payBtn}
                  disabled={paying}
                >
                  {paying ? 'Confirming Payment...' : `Confirm Payment — KES ${Number(order.total_amount).toLocaleString()}`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  loading: { padding: '3rem', textAlign: 'center', color: '#666' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', marginBottom: '2rem' },
  layout: { display: 'flex', gap: '2rem', alignItems: 'flex-start' },
  summaryCard: { width: '320px', flexShrink: 0, background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardTitle: { color: '#1a1a2e', marginBottom: '1rem' },
  orderId: { color: '#666', marginBottom: '1rem', fontSize: '0.9rem' },
  itemsList: { marginBottom: '1rem' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' },
  divider: { borderTop: '2px solid #f0f0f0', margin: '1rem 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' },
  totalLabel: { fontWeight: 'bold', color: '#1a1a2e' },
  totalAmount: { fontWeight: 'bold', color: '#c9a84c', fontSize: '1.1rem' },
  statusRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  paidBadge: { background: '#d1fae5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' },
  pendingBadge: { background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' },
  paymentCard: { flex: 1, background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  paymentHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' },
  mpesaInstructions: { background: '#f9f9f9', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' },
  instructionTitle: { fontWeight: 'bold', marginBottom: '0.5rem', color: '#1a1a2e' },
  instructionList: { paddingLeft: '1.25rem', color: '#555', lineHeight: '1.8', fontSize: '0.9rem' },
  error: { color: 'red', marginBottom: '1rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontWeight: '600', color: '#444', marginBottom: '0.35rem', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', fontSize: '1rem' },
  hint: { color: '#999', fontSize: '0.8rem', marginTop: '0.35rem' },
  payBtn: { width: '100%', padding: '1rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  successSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', textAlign: 'center' },
  successTitle: { color: '#1a1a2e', margin: '1rem 0 0.5rem' },
  successText: { color: '#666', marginBottom: '2rem' },
  ordersBtn: { padding: '0.75rem 2rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
}