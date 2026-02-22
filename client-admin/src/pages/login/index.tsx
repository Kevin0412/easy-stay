import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Tabs, message, Radio } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login, register, LoginParams, RegisterParams } from '@/services/auth'
import { useUserStore } from '@/store/user-store'
import styles from './index.module.scss'

export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const setUser = useUserStore((state) => state.setUser)

  // 登录提交
  const handleLogin = async (values: LoginParams) => {
    setLoading(true)
    try {
      const res = await login(values)
      const { token, user } = res.data.data

      // 保存到全局状态
      setUser(token, user)

      message.success('登录成功')

      // 跳转到来源页或首页
      const from = (location.state as any)?.from?.pathname || (user.role === 'admin' ? '/audit' : '/hotels')
      navigate(from, { replace: true })
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 403) {
        message.error('该账号为普通用户，无操作权限，请使用管理员或商户账号登录')
      } else if (status === 401) {
        message.error('账号或密码错误，请重新输入')
      }
      // 其他错误已由拦截器处理
    } finally {
      setLoading(false)
    }
  }

  // 注册提交
  const handleRegister = async (values: RegisterParams) => {
    setLoading(true)
    try {
      await register(values)
      message.success('注册成功，请登录')
      setActiveTab('login')
    } catch (error) {
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>易宿酒店管理后台</h1>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'login' | 'register')}
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form onFinish={handleLogin} autoComplete="off">
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="用户名"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="密码"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              )
            },
            {
              key: 'register',
              label: '注册',
              children: (
                <Form
                  onFinish={handleRegister}
                  initialValues={{ role: 'merchant' }}
                  autoComplete="off"
                >
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: '请输入用户名' },
                      { min: 3, message: '用户名至少3个字符' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="用户名（至少3个字符）"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码至少6个字符' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="密码（至少6个字符）"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="role"
                    label="角色"
                    rules={[{ required: true, message: '请选择角色' }]}
                  >
                    <Radio.Group>
                      <Radio value="merchant">商户</Radio>
                      <Radio value="admin">管理员</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
