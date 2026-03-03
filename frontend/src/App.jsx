import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import ProductsPage from './pages/buyer/ProductsPage'
import ProductDetail from './pages/buyer/ProductDetail'
import Orders from './pages/buyer/Orders'
import Messages from './pages/buyer/Messages'
import Payment from './pages/buyer/Payment'
import BuyerProfile from './pages/buyer/Profile'
import SupplierDashboard from './pages/supplier/SupplierDashboard'
import AddProduct from './pages/supplier/AddProduct'
import SupplierProducts from './pages/supplier/SupplierProducts'
import SupplierOrders from './pages/supplier/SupplierOrders'
import SupplierMessages from './pages/supplier/SupplierMessages'
import EditProduct from './pages/supplier/EditProduct'
import SupplierProfile from './pages/supplier/SupplierProfile'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import VerifySuppliers from './pages/admin/VerifySuppliers'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminPayments from './pages/admin/AdminPayments'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer */}
        <Route path="/buyer/dashboard" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />
        <Route path="/buyer/products" element={<ProtectedRoute allowedRoles={['buyer']}><ProductsPage /></ProtectedRoute>} />
        <Route path="/buyer/products/:id" element={<ProtectedRoute allowedRoles={['buyer']}><ProductDetail /></ProtectedRoute>} />
        <Route path="/buyer/orders" element={<ProtectedRoute allowedRoles={['buyer']}><Orders /></ProtectedRoute>} />
        <Route path="/buyer/messages" element={<ProtectedRoute allowedRoles={['buyer']}><Messages /></ProtectedRoute>} />
        <Route path="/buyer/payment/:orderId" element={<ProtectedRoute allowedRoles={['buyer']}><Payment /></ProtectedRoute>} />
        <Route path="/buyer/profile" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerProfile /></ProtectedRoute>} />

        {/* Supplier */}
        <Route path="/supplier/dashboard" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierDashboard /></ProtectedRoute>} />
        <Route path="/supplier/products" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierProducts /></ProtectedRoute>} />
        <Route path="/supplier/add-product" element={<ProtectedRoute allowedRoles={['supplier']}><AddProduct /></ProtectedRoute>} />
        <Route path="/supplier/edit-product/:id" element={<ProtectedRoute allowedRoles={['supplier']}><EditProduct /></ProtectedRoute>} />
        <Route path="/supplier/orders" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierOrders /></ProtectedRoute>} />
        <Route path="/supplier/messages" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierMessages /></ProtectedRoute>} />
        <Route path="/supplier/profile" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierProfile /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/verify-suppliers" element={<ProtectedRoute allowedRoles={['admin']}><VerifySuppliers /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin']}><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><AdminPayments /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App