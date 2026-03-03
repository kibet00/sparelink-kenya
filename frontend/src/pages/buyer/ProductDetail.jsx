import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Package, ShoppingCart } from 'lucide-react'
import api from '../../utils/api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [ordering, setOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [shippingInfo, setShippingInfo] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}/`)
        setProduct(response.data)
      } catch (err) {
        console.error('Failed to fetch product', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleOrder = async () => {
    setOrdering(true)
    try {
      await api.post('/orders/place/', {
        shipping_info: shippingInfo,
        items: [{ product: product.id, quantity }],
      })
      setOrderSuccess(true)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to place order.')
    } finally {
      setOrdering(false)
    }
  }

  if (loading) return <div style={styles.loading}>Loading product...</div>
  if (!product) return <div style={styles.loading}>Product not found.</div>

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      {orderSuccess && (
        <div style={styles.successBanner}>
          Order placed successfully! Go to My Orders to track it.
        </div>
      )}

      <div style={styles.layout}>
        {/* Image */}
        <div style={styles.imageSection}>
          {product.image ? (
            <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} style={styles.image} />
          ) : (
            <div style={styles.noImage}>
              <Package size={64} color="#ccc" />
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div style={styles.details}>
          <h1 style={styles.productName}>{product.name}</h1>
          <p style={styles.brand}>{product.brand}</p>

          <div style={styles.rating}>
            <Star size={16} color="#c9a84c" fill="#c9a84c" />
            <span>{product.average_rating || 'No ratings yet'}</span>
            <span style={styles.reviewCount}>({product.review_count} reviews)</span>
          </div>

          <p style={styles.price}>KES {Number(product.price).toLocaleString()}</p>
          <p style={product.in_stock ? styles.inStock : styles.outOfStock}>
            {product.in_stock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          <div style={styles.infoTable}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Part Number</span>
              <span>{product.part_number || '-'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Vehicle Model</span>
              <span>{product.vehicle_model}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Supplier</span>
              <span>{product.supplier_name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Location</span>
              <span>{product.supplier_location || '-'}</span>
            </div>
          </div>

          {product.description && (
            <div style={styles.description}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {product.in_stock && (
            <div style={styles.orderSection}>
              <div style={styles.quantityRow}>
                <label style={styles.infoLabel}>Quantity</label>
                <div style={styles.quantityControls}>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span style={styles.qtyValue}>{quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.infoLabel}>Shipping / Pickup Info</label>
                <textarea
                  value={shippingInfo}
                  onChange={(e) => setShippingInfo(e.target.value)}
                  placeholder="Enter your address or pickup preference..."
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              <button style={styles.orderBtn} onClick={handleOrder} disabled={ordering}>
                <ShoppingCart size={16} />
                {ordering ? 'Placing Order...' : `Order Now — KES ${Number(product.price * quantity).toLocaleString()}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  loading: { padding: '3rem', textAlign: 'center', color: '#666' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', marginBottom: '1.5rem' },
  successBanner: { background: '#d1fae5', border: '1px solid #10b981', color: '#065f46', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' },
  layout: { display: 'flex', gap: '2rem', background: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  imageSection: { width: '320px', flexShrink: 0 },
  image: { width: '100%', borderRadius: '8px', objectFit: 'cover' },
  noImage: { height: '280px', background: '#f9f9f9', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc' },
  details: { flex: 1 },
  productName: { color: '#1a1a2e', marginBottom: '0.25rem' },
  brand: { color: '#666', marginBottom: '0.75rem' },
  rating: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' },
  reviewCount: { color: '#999', fontSize: '0.85rem' },
  price: { fontSize: '1.75rem', fontWeight: 'bold', color: '#c9a84c', marginBottom: '0.5rem' },
  inStock: { color: 'green', marginBottom: '1.5rem', fontWeight: '600' },
  outOfStock: { color: 'red', marginBottom: '1.5rem', fontWeight: '600' },
  infoTable: { background: '#f9f9f9', borderRadius: '6px', padding: '1rem', marginBottom: '1.5rem' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' },
  infoLabel: { color: '#666', fontWeight: '600' },
  description: { marginBottom: '1.5rem' },
  orderSection: { borderTop: '1px solid #f0f0f0', paddingTop: '1.5rem' },
  quantityRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  quantityControls: { display: 'flex', alignItems: 'center', gap: '1rem' },
  qtyBtn: { width: '32px', height: '32px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem' },
  qtyValue: { fontWeight: 'bold', fontSize: '1.1rem' },
  field: { marginBottom: '1rem' },
  textarea: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem', boxSizing: 'border-box', resize: 'vertical' },
  orderBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' },
}