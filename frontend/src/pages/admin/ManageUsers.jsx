import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserX, UserCheck } from 'lucide-react'
import api from '../../utils/api'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/admin/all/')
      setUsers(response.data.results || response.data)
    } catch (err) {
      console.error('Failed to fetch users', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async (userId) => {
    try {
      const response = await api.post(`/users/admin/suspend/${userId}/`)
      alert(response.data.message)
      fetchUsers()
    } catch (err) {
      console.error('Failed to suspend user', err)
    }
  }

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true
    return u.role === filter
  })

  const roleColor = (role) => {
    if (role === 'admin') return { background: '#ede9fe', color: '#5b21b6' }
    if (role === 'supplier') return { background: '#dbeafe', color: '#1e40af' }
    return { background: '#d1fae5', color: '#065f46' }
  }

  const statusColor = (status) => {
    if (status === 'active') return { background: '#d1fae5', color: '#065f46' }
    if (status === 'pending') return { background: '#fef3c7', color: '#92400e' }
    return { background: '#fee2e2', color: '#991b1b' }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={styles.title}>Manage Users</h1>
      </div>

      <div style={styles.filters}>
        {['all', 'buyer', 'supplier', 'admin'].map(f => (
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
        <p>Loading users...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{user.full_name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.phone}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...roleColor(user.role) }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...statusColor(user.status) }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={user.status === 'suspended' ? styles.reinstateBtn : styles.suspendBtn}
                      onClick={() => handleSuspend(user.id)}
                    >
                      {user.status === 'suspended' ? <UserCheck size={14} /> : <UserX size={14} />}
                      {user.status === 'suspended' ? ' Reinstate' : ' Suspend'}
                    </button>
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
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  filterBtn: { padding: '0.5rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  filterActive: { padding: '0.5rem 1rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  tableWrapper: { background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e', color: 'white' },
  th: { padding: '1rem', textAlign: 'left', fontSize: '0.85rem' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '1rem', fontSize: '0.9rem', color: '#444' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  suspendBtn: { display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  reinstateBtn: { display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
}