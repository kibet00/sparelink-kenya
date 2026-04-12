import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import api from '../../utils/api'

export default function Reviews() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [productRes, reviewsRes] = await Promise.all([
        api.get(`/products/${id}/`),
        api.get(`/products/${id}/reviews/`),
      ])
      setProduct(productRes.data)
      const reviewList = reviewsRes.data.results || reviewsRes.data
      setReviews(reviewList)
      const hasReviewed = reviewList.some(r => r.buyer_name === user.fullName)
      setAlreadyReviewed(hasReviewed)
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post(`/products/${id}/reviews/`, { rating, comment })
      setSuccess('Review submitted successfully!')
      setRating(0)
      setComment('')
      setAlreadyReviewed(true)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit review. You may have already reviewed this product.')
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }))

  if (loading) return <div style={styles.loading}>Loading reviews...</div>
  if (!product) return <div style={styles.loading}>Product not found.</div>

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(`/buyer/products/${id}`)} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back to Product
      </button>

      <div style={styles.productBar}>
        <div>
          <h1 style={styles.productName}>{product.name}</h1>
          <p style={styles.productBrand}>{product.brand} — {product.vehicle_model}</p>
        </div>
        <div style={styles.overallRating}>
          <p style={styles.bigRating}>{averageRating || 'N/A'}</p>
          <div style={styles.starsRow}>
            {[1,2,3,4,5].map(s => (
              <Star
                key={s}
                size={20}
                color="#c9a84c"
                fill={averageRating && s <= Math.round(averageRating) ? '#c9a84c' : 'none'}
              />
            ))}
          </div>
          <p style={styles.reviewCount}>{reviews.length} reviews</p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Left — Rating Breakdown + Submit Form */}
        <div style={styles.leftPanel}>

          {/* Rating Breakdown */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Rating Breakdown</h3>
            {ratingCounts.map(({ star, count, percent }) => (
              <div key={star} style={styles.ratingRow}>
                <div style={styles.ratingLabel}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={12} color="#c9a84c" fill={s <= star ? '#c9a84c' : 'none'} />
                  ))}
                </div>
                <div style={styles.ratingBar}>
                  <div style={{ ...styles.ratingBarFill, width: `${percent}%` }} />
                </div>
                <span style={styles.ratingBarCount}>{count}</span>
              </div>
            ))}
          </div>

          {/* Submit Review Form */}
          {alreadyReviewed ? (
            <div style={styles.card}>
              <div style={styles.alreadyReviewed}>
                <Star size={32} color="#c9a84c" fill="#c9a84c" />
                <p style={styles.alreadyText}>You have already reviewed this product.</p>
              </div>
            </div>
          ) : (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Write a Review</h3>
              {error && <p style={styles.error}>{error}</p>}
              {success && <p style={styles.success}>{success}</p>}
              <form onSubmit={handleSubmit}>
                <div style={styles.field}>
                  <label style={styles.label}>Your Rating</label>
                  <div style={styles.starSelector}>
                    {[1,2,3,4,5].map(s => (
                      <Star
                        key={s}
                        size={36}
                        color="#c9a84c"
                        fill={s <= (hoveredRating || rating) ? '#c9a84c' : 'none'}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredRating(s)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(s)}
                      />
                    ))}
                  </div>
                  {rating > 0 && (
                    <p style={styles.ratingText}>
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                    </p>
                  )}
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Your Review (optional)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    style={styles.textarea}
                    rows={4}
                  />
                </div>
                <button type="submit" style={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right — Reviews List */}
        <div style={styles.rightPanel}>
          <h3 style={styles.cardTitle}>All Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <div style={styles.noReviews}>
              <Star size={48} color="#ccc" />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div style={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review.id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewAvatar}>
                      {review.buyer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.reviewMeta}>
                      <p style={styles.reviewerName}>{review.buyer_name}</p>
                      <div style={styles.reviewStars}>
                        {[1,2,3,4,5].map(s => (
                          <Star
                            key={s}
                            size={14}
                            color="#c9a84c"
                            fill={s <= review.rating ? '#c9a84c' : 'none'}
                          />
                        ))}
                        <span style={styles.ratingWord}>
                          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][review.rating]}
                        </span>
                      </div>
                    </div>
                    <span style={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString('en-KE', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
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
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  loading: { padding: '3rem', textAlign: 'center', color: '#666' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', marginBottom: '1.5rem' },
  productBar: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  productName: { color: '#1a1a2e', marginBottom: '0.25rem' },
  productBrand: { color: '#999', fontSize: '0.9rem' },
  overallRating: { textAlign: 'center' },
  bigRating: { fontSize: '3rem', fontWeight: 'bold', color: '#c9a84c', margin: 0 },
  starsRow: { display: 'flex', gap: '0.25rem', justifyContent: 'center', margin: '0.25rem 0' },
  reviewCount: { color: '#999', fontSize: '0.85rem', margin: 0 },
  layout: { display: 'flex', gap: '2rem', alignItems: 'flex-start' },
  leftPanel: { width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  rightPanel: { flex: 1 },
  card: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardTitle: { color: '#1a1a2e', marginBottom: '1.25rem', fontWeight: '700' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' },
  ratingLabel: { display: 'flex', gap: '0.1rem', width: '80px' },
  ratingBar: { flex: 1, height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' },
  ratingBarFill: { height: '100%', background: '#c9a84c', borderRadius: '4px', transition: 'width 0.3s' },
  ratingBarCount: { color: '#999', fontSize: '0.8rem', width: '20px', textAlign: 'right' },
  alreadyReviewed: { textAlign: 'center', padding: '1rem', color: '#666' },
  alreadyText: { marginTop: '0.75rem', color: '#666' },
  error: { color: 'red', marginBottom: '1rem', fontSize: '0.9rem' },
  success: { color: 'green', marginBottom: '1rem', fontSize: '0.9rem' },
  field: { marginBottom: '1.25rem' },
  label: { display: 'block', fontWeight: '600', color: '#444', marginBottom: '0.5rem', fontSize: '0.9rem' },
  starSelector: { display: 'flex', gap: '0.5rem' },
  ratingText: { color: '#c9a84c', fontWeight: '600', marginTop: '0.5rem', fontSize: '0.9rem' },
  textarea: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical', fontSize: '0.9rem' },
  submitBtn: { width: '100%', padding: '0.75rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' },
  noReviews: { background: 'white', padding: '3rem', borderRadius: '8px', textAlign: 'center', color: '#999', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  reviewCard: { background: 'white', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  reviewHeader: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' },
  reviewAvatar: { width: '40px', height: '40px', background: '#1a1a2e', color: '#c9a84c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 },
  reviewMeta: { flex: 1 },
  reviewerName: { fontWeight: '600', color: '#1a1a2e', margin: '0 0 0.25rem' },
  reviewStars: { display: 'flex', alignItems: 'center', gap: '0.2rem' },
  ratingWord: { color: '#c9a84c', fontSize: '0.8rem', fontWeight: '600', marginLeft: '0.35rem' },
  reviewDate: { color: '#999', fontSize: '0.8rem', flexShrink: 0 },
  reviewComment: { color: '#555', fontSize: '0.9rem', lineHeight: '1.6', marginLeft: '3.25rem' },
}