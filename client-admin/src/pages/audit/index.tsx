import { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, message } from 'antd'
import { CheckOutlined, StopOutlined } from '@ant-design/icons'
import { getHotels, approveHotel, offlineHotel, Hotel } from '@/services/hotel'
import HotelStatusTag from '@/components/hotel-status-tag'
import styles from './index.module.scss'

export default function Audit() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)

  // 获取待审核酒店列表
  const fetchPendingHotels = async () => {
    setLoading(true)
    try {
      const res = await getHotels({ status: 'pending' })
      setHotels(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingHotels()
  }, [])

  // 审核通过
  const handleApprove = (id: number, name: string) => {
    Modal.confirm({
      title: '确认审核通过',
      content: `确定审核通过「${name}」吗？`,
      onOk: async () => {
        await approveHotel(id)
        message.success('审核通过')
        fetchPendingHotels()
      }
    })
  }

  // 下线
  const handleOffline = (id: number, name: string) => {
    Modal.confirm({
      title: '确认下线',
      content: `确定下线「${name}」吗？`,
      onOk: async () => {
        await offlineHotel(id)
        message.success('已下线')
        fetchPendingHotels()
      }
    })
  }

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
      title: '提交时间',
      dataIndex: 'updated_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      width: 200,
      render: (_: any, record: Hotel) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id, record.name_cn)}
          >
            审核通过
          </Button>
          <Button
            size="small"
            danger
            icon={<StopOutlined />}
            onClick={() => handleOffline(record.id, record.name_cn)}
          >
            下线
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className={styles.container}>
      <h2>酒店审核</h2>

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
