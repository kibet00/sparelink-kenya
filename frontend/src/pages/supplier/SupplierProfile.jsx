import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Building } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

export default function SupplierProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    full_name: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    business_name: user?.businessName || '',
    business_location: user?.businessLocation || '',
  })
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.patch('/users/profile/', formData)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePassword = async (e) => {
    e.preventDefault()
    if (passwords.new_password !== passwords.confirm_password) {
      setError('New passwords do not match.')
      return
    }
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/users/profile/change-password/', passwords)
      setSuccess('Password changed successfully!')
      setPasswords({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/supplier/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={styles.title}>My Profile</h1>
      </div>

      <div style={styles.layout}>
        <div style={styles.avatarCard}>
          <div style={styles.avatar}>
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <h2 style={styles.avatarName}>{user?.fullName}</h2>
          <p style={styles.avatarEmail}>{user?.email}</p>
          <span style={user?.status === 'active' ? styles.activeBadge : styles.pendingBadge}>
            {user?.status === 'active' ? 'Verified Supplier' : 'Pending Verification'}
          </span>
        </div>

        <div style={styles.forms}>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Personal Information</h3>
            <form onSubmit={handleSaveProfile}>
              <div style={styles.grid}>
                <div style={styles.field}>
                  <label style={styles.label}>Full Name</label>
                  <input name="full_name" value={formData.full_name} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} style={styles.input} />
                </div>
              </div>

              <h3 style={{ ...styles.formTitle, marginTop: '1rem' }}>
                <Building size={18} /> Business Information
              </h3>
              <div style={styles.grid}>
                <div style={styles.field}>
                  <label style={styles.label}>Business Name</label>
                  <input name="business_name" value={formData.business_name} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Business Location</label>
                  <input name="business_location" value={formData.business_location} onChange={handleChange} style={styles.input} />
                </div>
              </div>
              <button type="submit" style={styles.saveBtn} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Change Password</h3>
            <form onSubmit={handleSavePassword}>
              <div style={styles.field}>
                <label style={styles.label}>Current Password</label>
                <input name="current_password" type="password" value={passwords.current_password} onChange={handlePasswordChange} style={styles.input} required />
              </div>
              <div style={styles.grid}>
                <div style={styles.field}>
                  <label style={styles.label}>New Password</label>
                  <input name="new_password" type="password" value={passwords.new_password} onChange={handlePasswordChange} style={styles.input} required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Confirm New Password</label>
                  <input name="confirm_password" type="password" value={passwords.confirm_password} onChange={handlePasswordChange} style={styles.input} required />
                </div>
              </div>
              <button type="submit" style={styles.saveBtn} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  title: { color: '#1a1a2e' },
  layout: { display: 'flex', gap: '2rem', alignItems: 'flex-start' },
  avatarCard: { width: '240px', flexShrink: 0, background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' },
  avatar: { width: '80px', height: '80px', background: '#1a1a2e', color: '#c9a84c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1rem' },
  avatarName: { color: '#1a1a2e', marginBottom: '0.25rem' },
  avatarEmail: { color: '#999', fontSize: '0.85rem', marginBottom: '1rem' },
  activeBadge: { background: '#d1fae5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem' },
  pendingBadge: { background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem' },
  forms: { flex: 1 },
  error: { color: 'red', marginBottom: '1rem' },
  success: { color: 'green', marginBottom: '1rem' },
  formCard: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  formTitle: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1a1a2e', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.35rem', fontWeight: '600' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
}