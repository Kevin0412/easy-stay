import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/store/user-store'

interface AuthRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export default function AuthRoute({ children, requireAdmin = false }: AuthRouteProps) {
  const location = useLocation()
  const { token, user } = useUserStore()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/hotels" replace />
  }

  return <>{children}</>
}
