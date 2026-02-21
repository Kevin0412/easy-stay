import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthRoute from '@/components/auth-route'
import AdminLayout from '@/components/layout/admin-layout'
import Login from '@/pages/login'
import HotelList from '@/pages/hotel-list'
import HotelEdit from '@/pages/hotel-edit'
import Audit from '@/pages/audit'

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
        element: <Navigate to="/hotels" replace />
      },
      {
        path: 'hotels',
        element: <HotelList />
      },
      {
        path: 'hotels/new',
        element: <HotelEdit />
      },
      {
        path: 'hotels/:id/edit',
        element: <HotelEdit />
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
