import { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Input, message, Typography, Select, Alert, Drawer, Descriptions, Image, Tag } from 'antd'
import { CheckOutlined, CloseOutlined, StopOutlined, RedoOutlined, BellOutlined, EyeOutlined } from '@ant-design/icons'
import { getHotels, approveHotel, rejectHotel, offlineHotel, restoreHotel, Hotel, HotelStatus } from '@/services/hotel'
import { getRoomsByHotelId, Room } from '@/services/room'
import { getPriceStrategiesByHotelId, PriceStrategy } from '@/services/price'
import HotelStatusTag from '@/components/hotel-status-tag'
import styles from './index.module.scss'

const { TextArea } = Input
const { Text } = Typography

function HotelDetail({ hotel }: { hotel: Hotel }) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [strategies, setStrategies] = useState<PriceStrategy[]>([])

  useEffect(() => {
    getRoomsByHotelId(hotel.id).then(res => setRooms(res.data.data || []))
    getPriceStrategiesByHotelId(hotel.id).then(res => setStrategies(res.data.data || []))
  }, [hotel.id])

  let imageList: string[] = []
  if (hotel.images) {
    try {
      imageList = JSON.parse(hotel.images)
    } catch {}
  }

  const tagList = [
    ...(hotel.tags ? hotel.tags.split(',').map((t) => t.trim()).filter(Boolean) : []),
    ...(hotel.facilities ? hotel.facilities.split(',').map((f) => f.trim()).filter(Boolean) : []),
  ]

  const nearbyList = hotel.nearby
    ? hotel.nearby.split(',').map((n) => n.trim()).filter(Boolean)
    : []

  const roomColumns = [
    { title: '房型', dataIndex: 'room_type' },
    { title: '价格/晚', dataIndex: 'price', render: (p: number) => `¥${p}` },
    { title: '库存', dataIndex: 'stock' },
    { title: '最多入住', dataIndex: 'max_guests', render: (n: number) => `${n}人` },
  ]

  const strategyColumns = [
    { title: '策略名称', dataIndex: 'strategy_name' },
    {
      title: '适用范围',
      render: (_: any, r: PriceStrategy) =>
        r.room_id ? (rooms.find(rm => rm.id === r.room_id)?.room_type || `房型${r.room_id}`) : '全酒店通用'
    },
    { title: '折扣', dataIndex: 'discount', render: (d: number) => `${+(d * 10).toFixed(1)}折` },
    { title: '有效期', render: (_: any, r: PriceStrategy) => `${r.start_date} ~ ${r.end_date}` },
    {
      title: '状态',
      render: (_: any, r: PriceStrategy) =>
        new Date(r.end_date) < new Date()
          ? <Tag color="default">已过期</Tag>
          : <Tag color="green">有效</Tag>
    },
  ]

  return (
    <div>
      <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="中文名">{hotel.name_cn}</Descriptions.Item>
        {hotel.name_en && <Descriptions.Item label="英文名">{hotel.name_en}</Descriptions.Item>}
        <Descriptions.Item label="地址">{hotel.address}</Descriptions.Item>
        <Descriptions.Item label="星级">{'★'.repeat(hotel.star)}</Descriptions.Item>
        {hotel.open_date && <Descriptions.Item label="开业日期">{hotel.open_date}</Descriptions.Item>}
        <Descriptions.Item label="审核状态">
          <HotelStatusTag status={hotel.status} />
          {hotel.status === 'rejected' && hotel.reject_reason && (
            <Text type="danger" style={{ display: 'block', marginTop: 4 }}>
              原因：{hotel.reject_reason}
            </Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">{new Date(hotel.updated_at).toLocaleString()}</Descriptions.Item>
      </Descriptions>

      {hotel.cover_image && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>封面图片</Text>
          <div style={{ marginTop: 8 }}>
            <Image src={hotel.cover_image} height={160} style={{ objectFit: 'cover', borderRadius: 4 }} />
          </div>
        </div>
      )}

      {imageList.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>图集</Text>
          <div style={{ marginTop: 8 }}>
            <Image.PreviewGroup>
              <Space wrap>
                {imageList.map((url, i) => (
                  <Image key={i} src={url} width={120} height={90} style={{ objectFit: 'cover', borderRadius: 4 }} />
                ))}
              </Space>
            </Image.PreviewGroup>
          </div>
        </div>
      )}

      {tagList.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>设施服务</Text>
          <div style={{ marginTop: 8 }}>
            <Space wrap>
              {tagList.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </Space>
          </div>
        </div>
      )}

      {nearbyList.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>附近景点</Text>
          <div style={{ marginTop: 8 }}>
            <Space wrap>
              {nearbyList.map((place) => <Tag key={place} color="blue">{place}</Tag>)}
            </Space>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <Text strong>房型信息</Text>
        <Table
          style={{ marginTop: 8 }}
          columns={roomColumns}
          dataSource={rooms}
          rowKey="id"
          size="small"
          pagination={false}
          locale={{ emptyText: '暂无房型' }}
        />
      </div>

      <div>
        <Text strong>折扣策略</Text>
        <Table
          style={{ marginTop: 8 }}
          columns={strategyColumns}
          dataSource={strategies}
          rowKey="id"
          size="small"
          pagination={false}
          locale={{ emptyText: '暂无折扣策略' }}
        />
      </div>
    </div>
  )
}

export default function Audit() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [keyword, setKeyword] = useState('')
  const [rejectModal, setRejectModal] = useState<{ open: boolean; hotel: Hotel | null }>({
    open: false,
    hotel: null
  })
  const [rejectReason, setRejectReason] = useState('')
  const [rejectLoading, setRejectLoading] = useState(false)
  const [detailDrawer, setDetailDrawer] = useState<{ open: boolean; hotel: Hotel | null }>({
    open: false,
    hotel: null
  })

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const [pending, published, rejected, offline] = await Promise.all([
        getHotels({ status: 'pending' }),
        getHotels({ status: 'published' }),
        getHotels({ status: 'rejected' }),
        getHotels({ status: 'offline' })
      ])
      const all = [
        ...pending.data.data,
        ...published.data.data,
        ...rejected.data.data,
        ...offline.data.data
      ]
      all.sort((a, b) => a.id - b.id)
      setHotels(all)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const displayedHotels = hotels
    .filter((h) => statusFilter === 'all' || h.status === statusFilter)
    .filter((h) => !keyword || h.name_cn.includes(keyword))

  const pendingCount = hotels.filter((h) => h.status === 'pending').length

  const handleApprove = (record: Hotel) => {
    Modal.confirm({
      title: '确认审核通过',
      content: `确定审核通过「${record.name_cn}」吗？`,
      onOk: async () => {
        await approveHotel(record.id)
        message.success('审核通过')
        fetchHotels()
      }
    })
  }

  const openRejectModal = (hotel: Hotel) => {
    setRejectReason('')
    setRejectModal({ open: true, hotel })
  }

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.warning('请填写不通过原因')
      return
    }
    setRejectLoading(true)
    try {
      await rejectHotel(rejectModal.hotel!.id, rejectReason.trim())
      message.success('已标记为不通过')
      setRejectModal({ open: false, hotel: null })
      fetchHotels()
    } finally {
      setRejectLoading(false)
    }
  }

  const handleOffline = (record: Hotel) => {
    Modal.confirm({
      title: '确认下线',
      content: `确定下线「${record.name_cn}」吗？下线后可以恢复。`,
      onOk: async () => {
        await offlineHotel(record.id)
        message.success('已下线')
        fetchHotels()
      }
    })
  }

  const handleRestore = (record: Hotel) => {
    Modal.confirm({
      title: '确认恢复',
      content: `确定恢复「${record.name_cn}」上线吗？`,
      onOk: async () => {
        await restoreHotel(record.id)
        message.success('已恢复上线')
        fetchHotels()
      }
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70
    },
    {
      title: '酒店名称',
      dataIndex: 'name_cn',
      width: 180
    },
    {
      title: '地址',
      dataIndex: 'address'
    },
    {
      title: '星级',
      dataIndex: 'star',
      width: 90,
      render: (star: number) => '★'.repeat(star)
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      width: 160,
      render: (status: Hotel['status'], record: Hotel) => (
        <Space direction="vertical" size={2}>
          <HotelStatusTag status={status} />
          {status === 'rejected' && record.reject_reason && (
            <Text type="danger" style={{ fontSize: 12 }}>
              原因：{record.reject_reason}
            </Text>
          )}
        </Space>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      width: 170,
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      width: 220,
      render: (_: any, record: Hotel) => (
        <Space wrap>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setDetailDrawer({ open: true, hotel: record })}
          >
            查看详情
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record)}
              >
                通过
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => openRejectModal(record)}
              >
                不通过
              </Button>
            </>
          )}
          {record.status === 'published' && (
            <Button
              size="small"
              danger
              icon={<StopOutlined />}
              onClick={() => handleOffline(record)}
            >
              下线
            </Button>
          )}
          {record.status === 'offline' && (
            <Button
              size="small"
              icon={<RedoOutlined />}
              onClick={() => handleRestore(record)}
            >
              恢复
            </Button>
          )}
          {record.status === 'rejected' && (
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={() => openRejectModal(record)}
            >
              修改原因
            </Button>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className={styles.container}>
      <h2>酒店审核</h2>

      {pendingCount > 0 && (
        <Alert
          type="info"
          icon={<BellOutlined />}
          showIcon
          style={{ marginBottom: 16 }}
          message={`有 ${pendingCount} 家酒店待审核`}
          description="请及时处理，通过或拒绝待审核酒店。"
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Input.Search
          style={{ width: 220 }}
          placeholder="搜索酒店名称"
          allowClear
          onSearch={setKeyword}
          onChange={(e) => { if (!e.target.value) setKeyword('') }}
        />
        <Select
          style={{ width: 160 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: '全部', value: 'all' },
            { label: '审核中', value: 'pending' },
            { label: '已通过', value: 'published' },
            { label: '未通过', value: 'rejected' },
            { label: '已下线', value: 'offline' }
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={displayedHotels}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="审核不通过"
        open={rejectModal.open}
        onOk={handleRejectConfirm}
        onCancel={() => setRejectModal({ open: false, hotel: null })}
        confirmLoading={rejectLoading}
        okText="确认不通过"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>酒店：{rejectModal.hotel?.name_cn}</p>
        <TextArea
          rows={4}
          placeholder="请填写不通过原因（必填）"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          maxLength={200}
          showCount
        />
      </Modal>

      <Drawer
        title="酒店详情"
        open={detailDrawer.open}
        onClose={() => setDetailDrawer({ open: false, hotel: null })}
        width={600}
      >
        {detailDrawer.hotel && <HotelDetail hotel={detailDrawer.hotel} />}
      </Drawer>
    </div>
  )
}
