import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import ProductsPage from './pages/buyer/ProductsPage'
import Orders from './pages/buyer/Orders'
import SupplierDashboard from './pages/supplier/SupplierDashboard'
import AddProduct from './pages/supplier/AddProduct'
import SupplierProducts from './pages/supplier/SupplierProducts'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import VerifySuppliers from './pages/admin/VerifySuppliers'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer */}
        <Route path="/buyer/dashboard" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />
        <Route path="/buyer/products" element={<ProtectedRoute allowedRoles={['buyer']}><ProductsPage /></ProtectedRoute>} />
        <Route path="/buyer/orders" element={<ProtectedRoute allowedRoles={['buyer']}><Orders /></ProtectedRoute>} />

        {/* Supplier */}
        <Route path="/supplier/dashboard" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierDashboard /></ProtectedRoute>} />
        <Route path="/supplier/products" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierProducts /></ProtectedRoute>} />
        <Route path="/supplier/add-product" element={<ProtectedRoute allowedRoles={['supplier']}><AddProduct /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/verify-suppliers" element={<ProtectedRoute allowedRoles={['admin']}><VerifySuppliers /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App