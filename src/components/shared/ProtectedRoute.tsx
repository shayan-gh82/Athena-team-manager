import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export default function ProtectedRoute() {
  const userId = useAppSelector((s) => s.auth.currentUserId)
  const location = useLocation()
  return userId ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />
}
