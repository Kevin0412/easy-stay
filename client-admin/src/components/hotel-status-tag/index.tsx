import { Tag } from 'antd'
import { HotelStatus } from '@/services/hotel'

const STATUS_CONFIG = {
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'processing', text: '待审核' },
  published: { color: 'success', text: '已发布' },
  offline: { color: 'error', text: '已下线' }
}

interface Props {
  status: HotelStatus
}

export default function HotelStatusTag({ status }: Props) {
  const config = STATUS_CONFIG[status]
  return <Tag color={config.color}>{config.text}</Tag>
}
