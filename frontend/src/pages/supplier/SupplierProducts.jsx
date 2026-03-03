import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import api from '../../utils/api'

export default function SupplierProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/supplier/my-listings/')
      setProducts(response.data.results || response.data)
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product from listings?')) return
    try {
      await api.delete(`/products/supplier/${id}/edit/`)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product', err)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Products</h1>
        <button style={styles.addBtn} onClick={() => navigate('/supplier/add-product')}>
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div style={styles.empty}>
          <Package size={48} color="#ccc" />
          <p>No products listed yet.</p>
          <button style={styles.addBtn} onClick={() => navigate('/supplier/add-product')}>
            <Plus size={16} /> Add Your First Product
          </button>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Brand</th>
                <th style={styles.th}>Vehicle</th>
                <th style={styles.th}>Price (KES)</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.productName}>{product.name}</div>
                    <div style={styles.partNumber}>{product.part_number}</div>
                  </td>
                  <td style={styles.td}>{product.brand || '-'}</td>
                  <td style={styles.td}>{product.vehicle_model}</td>
                  <td style={styles.td}>{Number(product.price).toLocaleString()}</td>
                  <td style={styles.td}>{product.stock}</td>
                  <td style={styles.td}>
                    <span style={product.in_stock ? styles.inStock : styles.outOfStock}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.editBtn}
                        onClick={() => navigate(`/supplier/edit-product/${product.id}`)}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={14} />
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
  )
}

const styles = {
  container: { padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { color: '#1a1a2e' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '3rem', color: '#999', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  tableWrapper: { background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e', color: 'white' },
  th: { padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '1rem', fontSize: '0.9rem', color: '#444' },
  productName: { fontWeight: '600', color: '#1a1a2e' },
  partNumber: { fontSize: '0.75rem', color: '#999' },
  inStock: { background: '#d1fae5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem' },
  outOfStock: { background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  editBtn: { padding: '0.4rem', background: '#e0f2fe', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#0369a1' },
  deleteBtn: { padding: '0.4rem', background: '#fee2e2', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#dc2626' },
}