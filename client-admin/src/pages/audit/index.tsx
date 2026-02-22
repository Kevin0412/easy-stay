import { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Input, message, Typography, Select, Alert } from 'antd'
import { CheckOutlined, CloseOutlined, StopOutlined, RedoOutlined, BellOutlined } from '@ant-design/icons'
import { getHotels, approveHotel, rejectHotel, offlineHotel, restoreHotel, Hotel, HotelStatus } from '@/services/hotel'
import HotelStatusTag from '@/components/hotel-status-tag'
import styles from './index.module.scss'

const { TextArea } = Input
const { Text } = Typography

export default function Audit() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<HotelStatus | undefined>()
  const [rejectModal, setRejectModal] = useState<{ open: boolean; hotel: Hotel | null }>({
    open: false,
    hotel: null
  })
  const [rejectReason, setRejectReason] = useState('')
  const [rejectLoading, setRejectLoading] = useState(false)

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
      all.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      setHotels(all)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const displayedHotels = statusFilter
    ? hotels.filter((h) => h.status === statusFilter)
    : hotels

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

      <div style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 160 }}
          placeholder="筛选审核状态"
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
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
    </div>
  )
}
