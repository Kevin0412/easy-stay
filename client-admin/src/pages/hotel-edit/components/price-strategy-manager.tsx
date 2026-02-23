import { useEffect, useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, InputNumber, DatePicker, Select, message, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  getPriceStrategiesByHotelId,
  createPriceStrategy,
  updatePriceStrategy,
  deletePriceStrategy,
  PriceStrategy,
} from '@/services/price'
import { getRoomsByHotelId, Room } from '@/services/room'

interface PriceStrategyManagerProps {
  hotelId: number
}

export default function PriceStrategyManager({ hotelId }: PriceStrategyManagerProps) {
  const [strategies, setStrategies] = useState<PriceStrategy[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStrategy, setEditingStrategy] = useState<PriceStrategy | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [strategiesRes, roomsRes] = await Promise.all([
        getPriceStrategiesByHotelId(hotelId),
        getRoomsByHotelId(hotelId),
      ])
      setStrategies(strategiesRes.data.data)
      setRooms(roomsRes.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [hotelId])

  const openModal = (strategy?: PriceStrategy) => {
    setEditingStrategy(strategy || null)
    if (strategy) {
      form.setFieldsValue({
        strategy_name: strategy.strategy_name,
        room_id: strategy.room_id ?? 'all',
        discount: strategy.discount,
        date_range: [dayjs(strategy.start_date), dayjs(strategy.end_date)],
      })
    } else {
      form.resetFields()
    }
    setModalOpen(true)
  }

  const handleSubmit = async (values: any) => {
    try {
      const [start, end] = values.date_range
      const room_id = values.room_id === 'all' ? null : values.room_id

      if (editingStrategy) {
        await updatePriceStrategy(editingStrategy.id, {
          strategy_name: values.strategy_name,
          discount: values.discount,
          start_date: dayjs(start).format('YYYY-MM-DD'),
          end_date: dayjs(end).format('YYYY-MM-DD'),
        })
        message.success('更新成功')
      } else {
        await createPriceStrategy({
          hotel_id: hotelId,
          room_id,
          strategy_name: values.strategy_name,
          discount: values.discount,
          start_date: dayjs(start).format('YYYY-MM-DD'),
          end_date: dayjs(end).format('YYYY-MM-DD'),
        })
        message.success('创建成功')
      }
      setModalOpen(false)
      fetchData()
    } catch (error) {
      // 错误已在拦截器处理
    }
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条价格策略吗？',
      onOk: async () => {
        await deletePriceStrategy(id)
        message.success('删除成功')
        fetchData()
      },
    })
  }

  const roomName = (room_id: number | null) => {
    if (!room_id) return <Tag color="blue">全酒店通用</Tag>
    const room = rooms.find((r) => r.id === room_id)
    return <Tag color="default">{room ? room.room_type : `房型 #${room_id}`}</Tag>
  }

  const isExpired = (end_date: string) => dayjs(end_date).isBefore(dayjs(), 'day')

  const columns = [
    {
      title: '策略名称',
      dataIndex: 'strategy_name',
    },
    {
      title: '适用范围',
      dataIndex: 'room_id',
      render: (room_id: number | null) => roomName(room_id),
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      width: 90,
      render: (discount: number) => (
        <Tag color="volcano">{Math.round(discount * 10)}折</Tag>
      ),
    },
    {
      title: '有效期',
      width: 200,
      render: (_: any, record: PriceStrategy) => (
        <span style={{ color: isExpired(record.end_date) ? '#ccc' : undefined }}>
          {record.start_date} ~ {record.end_date}
          {isExpired(record.end_date) && <Tag style={{ marginLeft: 6 }}>已过期</Tag>}
        </span>
      ),
    },
    {
      title: '操作',
      width: 140,
      render: (_: any, record: PriceStrategy) => (
        <Space>
          <Button size="small" onClick={() => openModal(record)}>编辑</Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="价格策略"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          添加策略
        </Button>
      }
      style={{ marginTop: 24 }}
    >
      <Table
        columns={columns}
        dataSource={strategies}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingStrategy ? '编辑价格策略' : '新建价格策略'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="strategy_name"
            label="策略名称"
            rules={[{ required: true, message: '请输入策略名称' }]}
          >
            <Input placeholder="如：国庆特惠、周末折扣" />
          </Form.Item>

          <Form.Item
            name="room_id"
            label="适用范围"
            initialValue="all"
            rules={[{ required: true, message: '请选择适用范围' }]}
          >
            <Select>
              <Select.Option value="all">全酒店通用</Select.Option>
              {rooms.map((room) => (
                <Select.Option key={room.id} value={room.id}>
                  {room.room_type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="discount"
            label="折扣系数（如 0.8 表示八折）"
            rules={[{ required: true, message: '请输入折扣系数' }]}
          >
            <InputNumber min={0.01} max={0.99} step={0.01} style={{ width: '100%' }} placeholder="0.01 ~ 0.99" />
          </Form.Item>

          <Form.Item
            name="date_range"
            label="有效期"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
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
