import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Package } from 'lucide-react'
import api from '../../utils/api'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/')
      setProducts(response.data.results || response.data)
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async (productId) => {
    setReviewsLoading(true)
    try {
      const response = await api.get(`/products/${productId}/reviews/`)
      setReviews(response.data.results || response.data)
    } catch (err) {
      console.error('Failed to fetch reviews', err)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    fetchReviews(product.id)
  }

  const handleDeactivate = async (productId) => {
    if (!window.confirm('Deactivate this product?')) return
    try {
      await api.patch(`/products/supplier/${productId}/edit/`, { is_active: false })
      fetchProducts()
      setSelectedProduct(null)
    } catch (err) {
      console.error('Failed to deactivate', err)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={styles.title}>Products & Reviews</h1>
      </div>

      <div style={styles.layout}>
        {/* Products Table */}
        <div style={styles.tableSection}>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Product</th>
                    <th style={styles.th}>Supplier</th>
                    <th style={styles.th}>Price (KES)</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Rating</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      style={{
                        ...styles.tr,
                        background: selectedProduct?.id === product.id ? '#f0f7ff' : 'white',
                      }}
                    >
                      <td style={styles.td}>
                        <div style={styles.productName}>{product.name}</div>
                        <div style={styles.productBrand}>{product.brand} — {product.vehicle_model}</div>
                      </td>
                      <td style={styles.td}>{product.supplier_name}</td>
                      <td style={styles.td}>{Number(product.price).toLocaleString()}</td>
                      <td style={styles.td}>{product.stock}</td>
                      <td style={styles.td}>
                        <div style={styles.ratingCell}>
                          <Star size={14} color="#c9a84c" fill="#c9a84c" />
                          <span>{product.average_rating || 'N/A'}</span>
                          <span style={styles.reviewCount}>({product.review_count})</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            style={styles.viewBtn}
                            onClick={() => handleSelectProduct(product)}
                          >
                            View Reviews
                          </button>
                          <button
                            style={styles.deactivateBtn}
                            onClick={() => handleDeactivate(product.id)}
                          >
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reviews Panel */}
        {selectedProduct && (
          <div style={styles.reviewsPanel}>
            <div style={styles.reviewsPanelHeader}>
              <div>
                <h3 style={styles.reviewsTitle}>{selectedProduct.name}</h3>
                <p style={styles.reviewsSubtitle}>
                  {selectedProduct.review_count} reviews — Avg: {selectedProduct.average_rating || 'N/A'}
                </p>
              </div>
              <button style={styles.closeBtn} onClick={() => setSelectedProduct(null)}>✕</button>
            </div>

            {reviewsLoading ? (
              <p style={styles.loadingText}>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div style={styles.noReviews}>
                <Star size={32} color="#ccc" />
                <p>No reviews yet for this product.</p>
              </div>
            ) : (
              <div style={styles.reviewsList}>
                {reviews.map((review) => (
                  <div key={review.id} style={styles.reviewCard}>
                    <div style={styles.reviewHeader}>
                      <div style={styles.reviewAvatar}>
                        {review.buyer_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={styles.reviewerName}>{review.buyer_name}</p>
                        <div style={styles.stars}>
                          {[1,2,3,4,5].map(s => (
                            <Star
                              key={s}
                              size={14}
                              color="#c9a84c"
                              fill={s <= review.rating ? '#c9a84c' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <span style={styles.reviewDate}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p style={styles.reviewComment}>{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  title: { color: '#1a1a2e' },
  layout: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
  tableSection: { flex: 1 },
  tableWrapper: { background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e', color: 'white' },
  th: { padding: '1rem', textAlign: 'left', fontSize: '0.85rem' },
  tr: { borderBottom: '1px solid #f0f0f0', cursor: 'pointer' },
  td: { padding: '1rem', fontSize: '0.9rem', color: '#444' },
  productName: { fontWeight: '600', color: '#1a1a2e' },
  productBrand: { fontSize: '0.75rem', color: '#999' },
  ratingCell: { display: 'flex', alignItems: 'center', gap: '0.25rem' },
  reviewCount: { color: '#999', fontSize: '0.8rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  viewBtn: { padding: '0.4rem 0.75rem', background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  deactivateBtn: { padding: '0.4rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  reviewsPanel: { width: '360px', flexShrink: 0, background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },
  reviewsPanelHeader: { padding: '1.25rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#1a1a2e' },
  reviewsTitle: { color: 'white', margin: 0, fontSize: '1rem' },
  reviewsSubtitle: { color: '#aaa', fontSize: '0.8rem', margin: '0.25rem 0 0' },
  closeBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' },
  loadingText: { padding: '1rem', color: '#666' },
  noReviews: { padding: '2rem', textAlign: 'center', color: '#999' },
  reviewsList: { maxHeight: '600px', overflowY: 'auto' },
  reviewCard: { padding: '1rem', borderBottom: '1px solid #f9f9f9' },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' },
  reviewAvatar: { width: '32px', height: '32px', background: '#1a1a2e', color: '#c9a84c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 },
  reviewerName: { fontWeight: '600', color: '#1a1a2e', fontSize: '0.85rem', margin: 0 },
  stars: { display: 'flex', gap: '0.1rem' },
  reviewDate: { color: '#999', fontSize: '0.75rem', marginLeft: 'auto' },
  reviewComment: { color: '#555', fontSize: '0.85rem', lineHeight: '1.5', marginLeft: '2.75rem' },
}