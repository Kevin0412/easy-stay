import { Tag } from 'antd'
import { HotelStatus } from '@/services/hotel'

const STATUS_CONFIG = {
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'processing', text: '审核中' },
  published: { color: 'success', text: '已通过' },
  rejected: { color: 'error', text: '未通过' },
  offline: { color: 'warning', text: '已下线' }
}

interface Props {
  status: HotelStatus
}

export default function HotelStatusTag({ status }: Props) {
  const config = STATUS_CONFIG[status]
  return <Tag color={config.color}>{config.text}</Tag>
}
