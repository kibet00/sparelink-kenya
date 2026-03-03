import { useState, useEffect } from 'react'
import { Search, Filter, Star, Package } from 'lucide-react'
import api from '../../utils/api'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    brand: '',
    vehicle: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async (params = {}) => {
    setLoading(true)
    try {
      const response = await api.get('/products/', { params })
      setProducts(response.data.results || response.data)
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts({ search, ...filters })
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const clearFilters = () => {
    setFilters({ min_price: '', max_price: '', brand: '', vehicle: '' })
    setSearch('')
    fetchProducts()
  }

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <div style={styles.searchSection}>
        <h1 style={styles.title}>Browse Spare Parts</h1>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchBar}>
            <Search size={18} color="#999" style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by part name, brand, vehicle model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchBtn}>Search</button>
          </div>
        </form>
      </div>

      <div style={styles.body}>
        {/* Filters Sidebar */}
        <div style={styles.filters}>
          <div style={styles.filterHeader}>
            <Filter size={16} />
            <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>Filters</span>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Vehicle Model</label>
            <input
              name="vehicle"
              value={filters.vehicle}
              onChange={handleFilterChange}
              placeholder="e.g. Toyota Mark X"
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Brand</label>
            <input
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              placeholder="e.g. Toyota, BMW"
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Min Price (KES)</label>
            <input
              name="min_price"
              type="number"
              value={filters.min_price}
              onChange={handleFilterChange}
              placeholder="0"
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Max Price (KES)</label>
            <input
              name="max_price"
              type="number"
              value={filters.max_price}
              onChange={handleFilterChange}
              placeholder="Any"
              style={styles.filterInput}
            />
          </div>

          <button onClick={() => fetchProducts({ search, ...filters })} style={styles.applyBtn}>
            Apply Filters
          </button>
          <button onClick={clearFilters} style={styles.clearBtn}>
            Clear Filters
          </button>
        </div>

        {/* Products Grid */}
        <div style={styles.productsSection}>
          {loading ? (
            <div style={styles.centered}>Loading products...</div>
          ) : products.length === 0 ? (
            <div style={styles.empty}>
              <Package size={48} color="#ccc" />
              <p>No products found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {products.map((product) => (
                <div key={product.id} style={styles.card}>
                  <div style={styles.cardImage}>
                    {product.image ? (
                      <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} style={styles.image} />
                    ) : (
                      <div style={styles.noImage}>
                        <Package size={40} color="#ccc" />
                      </div>
                    )}
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.brand}>{product.brand}</p>
                    <p style={styles.vehicle}>{product.vehicle_model}</p>
                    <div style={styles.cardFooter}>
                      <div>
                        <p style={styles.price}>KES {Number(product.price).toLocaleString()}</p>
                        <p style={product.in_stock ? styles.inStock : styles.outOfStock}>
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                      <div style={styles.rating}>
                        <Star size={14} color="#c9a84c" fill="#c9a84c" />
                        <span>{product.average_rating || 'N/A'}</span>
                      </div>
                    </div>
                    <p style={styles.supplier}>Seller: {product.supplier_name}</p>
                    <button style={styles.viewBtn}>View Details</button>
                  </div>
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
  searchSection: { marginBottom: '2rem' },
  title: { color: '#1a1a2e', marginBottom: '1rem' },
  searchForm: { width: '100%' },
  searchBar: { display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '0.5rem 1rem', gap: '0.5rem' },
  searchIcon: { flexShrink: 0 },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '1rem', padding: '0.25rem' },
  searchBtn: { padding: '0.5rem 1.5rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  body: { display: 'flex', gap: '2rem' },
  filters: { width: '220px', flexShrink: 0, background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', height: 'fit-content' },
  filterHeader: { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', fontWeight: 'bold' },
  filterGroup: { marginBottom: '1rem' },
  filterLabel: { display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.35rem' },
  filterInput: { width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.9rem' },
  applyBtn: { width: '100%', padding: '0.6rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '0.5rem' },
  clearBtn: { width: '100%', padding: '0.6rem', background: 'white', color: '#1a1a2e', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  productsSection: { flex: 1 },
  centered: { textAlign: 'center', padding: '3rem', color: '#666' },
  empty: { textAlign: 'center', padding: '3rem', color: '#999' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' },
  card: { background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },
  cardImage: { height: '160px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  noImage: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' },
  cardBody: { padding: '1rem' },
  productName: { fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.25rem', fontSize: '0.95rem' },
  brand: { color: '#666', fontSize: '0.85rem', marginBottom: '0.25rem' },
  vehicle: { color: '#888', fontSize: '0.8rem', marginBottom: '0.75rem' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  price: { fontWeight: 'bold', color: '#c9a84c', fontSize: '1rem' },
  inStock: { color: 'green', fontSize: '0.75rem' },
  outOfStock: { color: 'red', fontSize: '0.75rem' },
  rating: { display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' },
  supplier: { fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' },
  viewBtn: { width: '100%', padding: '0.5rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
}