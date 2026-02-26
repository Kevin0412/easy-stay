import { useEffect, useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, InputNumber, message, Upload } from 'antd'
import type { UploadFile } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getRoomsByHotelId, createRoom, updateRoom, deleteRoom, Room, RoomFormData } from '@/services/room'
import { useUserStore } from '@/store/user-store'

interface RoomManagerProps {
  hotelId: number
}

export default function RoomManager({ hotelId }: RoomManagerProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([])
  const [form] = Form.useForm()
  const token = useUserStore((state) => state.token)

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

  const openModal = (room?: Room) => {
    setEditingRoom(room || null)
    if (room) {
      form.setFieldsValue(room)
      setImageFileList(
        room.image
          ? [{ uid: '-1', name: 'image', status: 'done', url: room.image }]
          : []
      )
    } else {
      form.resetFields()
      setImageFileList([])
    }
    setModalOpen(true)
  }

  const handleSubmit = async (values: any) => {
    try {
      const image = imageFileList[0]?.response?.data?.url || imageFileList[0]?.url || undefined

      const formData: RoomFormData = {
        hotel_id: hotelId,
        room_type: values.room_type,
        price: values.price,
        stock: values.stock,
        max_guests: values.max_guests,
        image,
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
      title: '图片',
      dataIndex: 'image',
      width: 90,
      render: (image: string) =>
        image ? (
          <img
            src={image}
            alt="房型图片"
            style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <span style={{ color: '#ccc', fontSize: 12 }}>无图片</span>
        )
    },
    { title: '房型名称', dataIndex: 'room_type' },
    { title: '价格（元/晚）', dataIndex: 'price' },
    { title: '库存', dataIndex: 'stock' },
    { title: '最多入住人数', dataIndex: 'max_guests' },
    {
      title: '操作',
      render: (_: any, record: Room) => (
        <Space>
          <Button size="small" onClick={() => openModal(record)}>编辑</Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
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

          <Form.Item label="房型图片（可选）">
            <Upload
              action="/api/upload"
              headers={{ Authorization: `Bearer ${token}` }}
              listType="picture-card"
              fileList={imageFileList}
              maxCount={1}
              accept="image/*"
              onChange={({ fileList }) => setImageFileList(fileList)}
            >
              {imageFileList.length < 1 && (
                <div><PlusOutlined /><div style={{ marginTop: 8 }}>上传图片</div></div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
