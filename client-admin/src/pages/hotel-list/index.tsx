import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Space, Select, Input, Modal, message, Alert, Typography } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getHotels, deleteHotel, publishHotel, Hotel, HotelStatus } from '@/services/hotel'
import { useUserStore } from '@/store/user-store'
import HotelStatusTag from '@/components/hotel-status-tag'
import styles from './index.module.scss'

const { Text } = Typography

export default function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [starFilter, setStarFilter] = useState<number>(0)
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const res = await getHotels({
        status: statusFilter === 'all' ? undefined : statusFilter as HotelStatus,
        star: starFilter === 0 ? undefined : starFilter,
        keyword: keyword || undefined
      })
      setHotels([...res.data.data].sort((a, b) => a.id - b.id))
    } catch (error) {
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [statusFilter, starFilter, keyword])

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
      onOk: async () => {
        await deleteHotel(id)
        message.success('删除成功')
        fetchHotels()
      }
    })
  }

  const handlePublish = async (id: number) => {
    await publishHotel(id)
    message.success('已提交审核')
    fetchHotels()
  }

  const rejectedHotels = hotels.filter((h) => h.status === 'rejected')

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80
    },
    {
      title: '酒店名称',
      dataIndex: 'name_cn',
      width: 200
    },
    {
      title: '地址',
      dataIndex: 'address'
    },
    {
      title: '星级',
      dataIndex: 'star',
      width: 100,
      render: (star: number) => '★'.repeat(star)
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 160,
      render: (status: HotelStatus, record: Hotel) => (
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
      title: '操作',
      width: 280,
      render: (_: any, record: Hotel) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/hotels/${record.id}/edit`)}>
            编辑
          </Button>

          {(record.status === 'draft' || record.status === 'rejected') && (
            <Button
              size="small"
              type="primary"
              onClick={() => handlePublish(record.id)}
            >
              {record.status === 'rejected' ? '修改后重新提交' : '提交审核'}
            </Button>
          )}

          <Button size="small" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>酒店管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/hotels/new')}
        >
          新建酒店
        </Button>
      </div>

      {rejectedHotels.length > 0 && (
        <Alert
          type="warning"
          icon={<ExclamationCircleOutlined />}
          showIcon
          style={{ marginBottom: 16 }}
          message={`有 ${rejectedHotels.length} 家酒店审核未通过`}
          description="请根据审核意见修改酒店信息后重新提交审核。"
        />
      )}

      <div className={styles.filters}>
        <Input.Search
          style={{ width: 220 }}
          placeholder="搜索酒店名称/地址"
          allowClear
          onSearch={setKeyword}
          onChange={(e) => { if (!e.target.value) setKeyword('') }}
        />

        <Select
          style={{ width: 150 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: '全部', value: 'all' },
            { label: '草稿', value: 'draft' },
            { label: '审核中', value: 'pending' },
            { label: '已通过', value: 'published' },
            { label: '审核未通过', value: 'rejected' },
            { label: '已下线', value: 'offline' }
          ]}
        />

        <Select
          style={{ width: 150, marginLeft: 16 }}
          value={starFilter}
          onChange={setStarFilter}
          options={[
            { label: '全部星级', value: 0 },
            ...[1, 2, 3, 4, 5].map((star) => ({ label: `${star}星`, value: star }))
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={hotels}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}
