import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: 'buyer',
    business_name: '',
    business_location: '',
    password: '',
    password2: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await register(formData)
      setSuccess(response.message)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>SpareLink Kenya</h2>
        <p style={styles.subtitle}>Create your account</p>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Full Name</label>
            <input name="full_name" value={formData.full_name} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label>I am a</label>
            <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
              <option value="buyer">Buyer</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>
          {formData.role === 'supplier' && (
            <>
              <div style={styles.field}>
                <label>Business Name</label>
                <input name="business_name" value={formData.business_name} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.field}>
                <label>Business Location</label>
                <input name="business_location" value={formData.business_location} onChange={handleChange} style={styles.input} />
              </div>
            </>
          )}
          <div style={styles.field}>
            <label>Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label>Confirm Password</label>
            <input name="password2" type="password" value={formData.password2} onChange={handleChange} style={styles.input} required />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', color: '#1a1a2e', marginBottom: '0.5rem' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '1.5rem' },
  error: { color: 'red', marginBottom: '1rem', textAlign: 'center' },
  success: { color: 'green', marginBottom: '1rem', textAlign: 'center' },
  field: { marginBottom: '1rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem', boxSizing: 'border-box' },
  button: { width: '100%', padding: '0.75rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  link: { textAlign: 'center', marginTop: '1rem' },
}