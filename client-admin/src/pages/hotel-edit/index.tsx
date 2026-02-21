import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, InputNumber, DatePicker, Button, Card, message, Space } from 'antd'
import dayjs from 'dayjs'
import { getHotelById, createHotel, updateHotel, HotelFormData } from '@/services/hotel'
import RoomManager from './components/room-manager'
import styles from './index.module.scss'

export default function HotelEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEdit = !!id

  // 编辑模式：加载酒店数据
  useEffect(() => {
    if (isEdit) {
      loadHotel()
    }
  }, [id])

  const loadHotel = async () => {
    try {
      const res = await getHotelById(Number(id))
      const hotel = res.data.data

      form.setFieldsValue({
        name_cn: hotel.name_cn,
        name_en: hotel.name_en,
        address: hotel.address,
        star: hotel.star,
        open_date: hotel.open_date ? dayjs(hotel.open_date) : null
      })
    } catch (error) {
      // 错误已在拦截器处理
    }
  }

  // 提交表单
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const formData: HotelFormData = {
        name_cn: values.name_cn,
        name_en: values.name_en,
        address: values.address,
        star: values.star,
        open_date: values.open_date ? dayjs(values.open_date).format('YYYY-MM-DD') : undefined
      }

      if (isEdit) {
        await updateHotel(Number(id), formData)
        message.success('更新成功')
      } else {
        await createHotel(formData)
        message.success('创建成功')
      }

      navigate('/hotels')
    } catch (error) {
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card title={isEdit ? '编辑酒店' : '新建酒店'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ star: 3 }}
        >
          <Form.Item
            name="name_cn"
            label="酒店中文名"
            rules={[{ required: true, message: '请输入酒店中文名' }]}
          >
            <Input placeholder="请输入酒店中文名" />
          </Form.Item>

          <Form.Item name="name_en" label="酒店英文名">
            <Input placeholder="请输入酒店英文名（可选）" />
          </Form.Item>

          <Form.Item
            name="address"
            label="酒店地址"
            rules={[{ required: true, message: '请输入酒店地址' }]}
          >
            <Input.TextArea rows={2} placeholder="请输入酒店地址" />
          </Form.Item>

          <Form.Item
            name="star"
            label="星级"
            rules={[{ required: true, message: '请选择星级' }]}
          >
            <InputNumber min={1} max={5} style={{ width: 120 }} />
          </Form.Item>

          <Form.Item name="open_date" label="开业日期">
            <DatePicker style={{ width: 200 }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
              <Button onClick={() => navigate('/hotels')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 房型管理（仅编辑模式） */}
      {isEdit && <RoomManager hotelId={Number(id)} />}
    </div>
  )
}
