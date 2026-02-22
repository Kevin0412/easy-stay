import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthRoute from '@/components/auth-route'
import AdminLayout from '@/components/layout/admin-layout'
import Login from '@/pages/login'
import HotelList from '@/pages/hotel-list'
import HotelEdit from '@/pages/hotel-edit'
import Audit from '@/pages/audit'
import { useUserStore } from '@/store/user-store'

function RootRedirect() {
  const user = useUserStore((state) => state.user)
  return <Navigate to={user?.role === 'admin' ? '/audit' : '/hotels'} replace />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <AuthRoute>
        <AdminLayout />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: <RootRedirect />
      },
      {
        path: 'hotels',
        element: (
          <AuthRoute merchantOnly>
            <HotelList />
          </AuthRoute>
        )
      },
      {
        path: 'hotels/new',
        element: (
          <AuthRoute merchantOnly>
            <HotelEdit />
          </AuthRoute>
        )
      },
      {
        path: 'hotels/:id/edit',
        element: (
          <AuthRoute merchantOnly>
            <HotelEdit />
          </AuthRoute>
        )
      },
      {
        path: 'audit',
        element: (
          <AuthRoute requireAdmin>
            <Audit />
          </AuthRoute>
        )
      }
    ]
  }
])
