import { useEffect, useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, InputNumber, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getRoomsByHotelId, createRoom, updateRoom, deleteRoom, Room, RoomFormData } from '@/services/room'

interface RoomManagerProps {
  hotelId: number
}

export default function RoomManager({ hotelId }: RoomManagerProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [form] = Form.useForm()

  // 加载房型列表
  const fetchRooms = async () => {
    setLoading(true)
    try {
      const res = await getRoomsByHotelId(hotelId)
      setRooms(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [hotelId])

  // 打开新建/编辑弹窗
  const openModal = (room?: Room) => {
    setEditingRoom(room || null)
    if (room) {
      form.setFieldsValue(room)
    } else {
      form.resetFields()
    }
    setModalOpen(true)
  }

  // 提交房型表单
  const handleSubmit = async (values: any) => {
    try {
      const formData: RoomFormData = {
        hotel_id: hotelId,
        room_type: values.room_type,
        price: values.price,
        stock: values.stock,
        max_guests: values.max_guests,
        image: values.image?.trim() || undefined
      }

      if (editingRoom) {
        await updateRoom(editingRoom.id, formData)
        message.success('更新成功')
      } else {
        await createRoom(formData)
        message.success('创建成功')
      }

      setModalOpen(false)
      fetchRooms()
    } catch (error) {
      // 错误已在拦截器处理
    }
  }

  // 删除房型
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个房型吗？',
      onOk: async () => {
        await deleteRoom(id)
        message.success('删除成功')
        fetchRooms()
      }
    })
  }

  const columns = [
    {
      title: '房型名称',
      dataIndex: 'room_type'
    },
    {
      title: '价格（元/晚）',
      dataIndex: 'price'
    },
    {
      title: '库存',
      dataIndex: 'stock'
    },
    {
      title: '最多入住人数',
      dataIndex: 'max_guests'
    },
    {
      title: '操作',
      render: (_: any, record: Room) => (
        <Space>
          <Button size="small" onClick={() => openModal(record)}>
            编辑
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <Card
      title="房型管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          添加房型
        </Button>
      }
      style={{ marginTop: 24 }}
    >
      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingRoom ? '编辑房型' : '新建房型'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="room_type"
            label="房型名称"
            rules={[{ required: true, message: '请输入房型名称' }]}
          >
            <Input placeholder="如：豪华大床房" />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格（元/晚）"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: '请输入库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="max_guests"
            label="最多入住人数"
            rules={[{ required: true, message: '请输入最多入住人数' }]}
            initialValue={2}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="image" label="房型图片 URL（可选）">
            <Input placeholder="https://example.com/room.jpg" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
