import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Verify from './pages/Verify'
import ForgotPassword from './pages/ForgotPassword'
import ForgotVerify from './pages/ForgotVerify'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/AdminDashboard'
import LandingPage from './pages/LandingPage'
import UserHistory from './pages/UserHistory'
import AdminHistory from './pages/AdminHistory'
export default function App() {
  return (
    
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/forgot-verify" element={<ForgotVerify/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/history' element={<UserHistory/>}/>
        <Route path="/admin/history" element={<AdminHistory/>}/>

      </Routes>
    
  )
}
