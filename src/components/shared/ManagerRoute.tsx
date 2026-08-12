import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export default function ManagerRoute() {
  const location = useLocation()
  const userId = useAppSelector((s)=>s.auth.currentUserId)
  const user = useAppSelector((s)=>s.users.users.find((item)=>item.id===userId))
  if (user?.role !== 'manager') return <Navigate to="/dashboard" replace state={{ deniedFrom: location.pathname }} />
  return <Outlet />
}
