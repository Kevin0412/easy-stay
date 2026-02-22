import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import { HomeOutlined, AuditOutlined, LogoutOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store/user-store'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
  const navigate = useNavigate()
  const { user, clearUser } = useUserStore()

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  const menuItems = user?.role === 'admin'
    ? [
        {
          key: '/audit',
          icon: <AuditOutlined />,
          label: '酒店审核',
          onClick: () => navigate('/audit')
        }
      ]
    : [
        {
          key: '/hotels',
          icon: <HomeOutlined />,
          label: '酒店管理',
          onClick: () => navigate('/hotels')
        }
      ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <h3>易宿管理后台</h3>
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>欢迎, {user?.username} ({user?.role === 'admin' ? '管理员' : '商户'})</span>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
