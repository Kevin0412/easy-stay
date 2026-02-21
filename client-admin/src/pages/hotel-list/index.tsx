import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Space, Select, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getHotels, deleteHotel, publishHotel, Hotel, HotelStatus } from '@/services/hotel'
import { useUserStore } from '@/store/user-store'
import HotelStatusTag from '@/components/hotel-status-tag'
import styles from './index.module.scss'

export default function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<HotelStatus | undefined>()
  const [starFilter, setStarFilter] = useState<number | undefined>()
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)

  // 获取酒店列表
  const fetchHotels = async () => {
    setLoading(true)
    try {
      const res = await getHotels({ status: statusFilter, star: starFilter })
      setHotels(res.data.data)
    } catch (error) {
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [statusFilter, starFilter])

  // 删除酒店
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

  // 提交审核
  const handlePublish = async (id: number) => {
    await publishHotel(id)
    message.success('已提交审核')
    fetchHotels()
  }

  // 表格列定义
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
      width: 120,
      render: (status: HotelStatus) => <HotelStatusTag status={status} />
    },
    {
      title: '操作',
      width: 300,
      render: (_: any, record: Hotel) => (
        <Space>
          <Button
            size="small"
            onClick={() => navigate(`/hotels/${record.id}/edit`)}
          >
            编辑
          </Button>

          {record.status === 'draft' && (
            <Button
              size="small"
              type="primary"
              onClick={() => handlePublish(record.id)}
            >
              提交审核
            </Button>
          )}

          <Button
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          >
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

      <div className={styles.filters}>
        <Select
          style={{ width: 150 }}
          placeholder="筛选状态"
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: '草稿', value: 'draft' },
            { label: '待审核', value: 'pending' },
            { label: '已发布', value: 'published' },
            { label: '已下线', value: 'offline' }
          ]}
        />

        <Select
          style={{ width: 150, marginLeft: 16 }}
          placeholder="筛选星级"
          allowClear
          value={starFilter}
          onChange={setStarFilter}
          options={[1, 2, 3, 4, 5].map((star) => ({
            label: `${star}星`,
            value: star
          }))}
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
