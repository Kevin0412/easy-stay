import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/store/user-store'

interface AuthRouteProps {
  children: ReactNode
  requireAdmin?: boolean
  merchantOnly?: boolean
}

export default function AuthRoute({ children, requireAdmin = false, merchantOnly = false }: AuthRouteProps) {
  const location = useLocation()
  const { token, user } = useUserStore()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/hotels" replace />
  }

  // 仅商户可访问（管理员无权限）
  if (merchantOnly && user?.role === 'admin') {
    return <Navigate to="/audit" replace />
  }

  return <>{children}</>
}
