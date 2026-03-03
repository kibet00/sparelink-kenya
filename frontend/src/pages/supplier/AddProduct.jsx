import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api from '../../utils/api'

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '', description: '', part_number: '',
    brand: '', vehicle_model: '', price: '',
    stock: '', category: '',
  })
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/products/categories/').then(res => setCategories(res.data))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => { if (formData[key]) data.append(key, formData[key]) })
      if (image) data.append('image', image)
      await api.post('/products/supplier/add/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess('Product listed successfully!')
      setTimeout(() => navigate('/supplier/products'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/supplier/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={styles.title}>Add New Product</h1>
      </div>

      <div style={styles.formCard}>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label>Part Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label>Brand</label>
              <input name="brand" value={formData.brand} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label>Part Number</label>
              <input name="part_number" value={formData.part_number} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label>Vehicle Model *</label>
              <input name="vehicle_model" value={formData.vehicle_model} onChange={handleChange} style={styles.input} required placeholder="e.g. Toyota Mark X, Honda Vezel" />
            </div>
            <div style={styles.field}>
              <label>Price (KES) *</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label>Stock Quantity *</label>
              <input name="stock" type="number" value={formData.stock} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={styles.input} />
            </div>
          </div>
          <div style={styles.field}>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={styles.textarea} rows={4} />
          </div>
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : 'List Product'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  title: { color: '#1a1a2e' },
  formCard: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  error: { color: 'red', marginBottom: '1rem' },
  success: { color: 'green', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  field: { marginBottom: '1rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem', boxSizing: 'border-box', resize: 'vertical' },
  submitBtn: { padding: '0.75rem 2rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
}