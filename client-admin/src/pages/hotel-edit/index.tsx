import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, InputNumber, DatePicker, Button, Card, message, Space, Checkbox, Upload } from 'antd'
import type { UploadFile } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { getHotelById, createHotel, updateHotel, HotelFormData } from '@/services/hotel'
import { useUserStore } from '@/store/user-store'
import { parseDate } from '@/utils/date'
import RoomManager from './components/room-manager'
import PriceStrategyManager from './components/price-strategy-manager'
import styles from './index.module.scss'

const HOTEL_TAGS = [
  '豪华套房',
  '免费停车',
  '亲子设施',
  '免费早餐',
  '江景/湖景',
  '停车场',
  '游泳池',
  '健身房',
  '会议室',
  'SPA',
  '洗衣服务',
  '24小时前台',
  '机场接送',
  '宠物友好',
]


export default function HotelEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [coverFileList, setCoverFileList] = useState<UploadFile[]>([])
  const [galleryFileList, setGalleryFileList] = useState<UploadFile[]>([])
  const isEdit = !!id
  const token = useUserStore((state) => state.token)

  useEffect(() => {
    if (isEdit) {
      loadHotel()
    }
  }, [id])

  const loadHotel = async () => {
    try {
      const res = await getHotelById(Number(id))
      const hotel = res.data.data

      // 封面图回填
      if (hotel.cover_image) {
        setCoverFileList([{ uid: '-1', name: 'cover', status: 'done', url: hotel.cover_image }])
      }

      // 图集回填
      if (hotel.images) {
        try {
          const urls: string[] = JSON.parse(hotel.images)
          setGalleryFileList(urls.map((url, i) => ({
            uid: `${-i - 1}`,
            name: `image-${i + 1}`,
            status: 'done' as const,
            url,
          })))
        } catch {}
      }

      // tags / facilities 合并后回填，兼容旧数据
      const tagList = [
        ...(hotel.tags ? hotel.tags.split(',').map((t) => t.trim()).filter(Boolean) : []),
        ...(hotel.facilities ? hotel.facilities.split(',').map((f) => f.trim()).filter(Boolean) : []),
      ]

      form.setFieldsValue({
        name_cn: hotel.name_cn,
        name_en: hotel.name_en,
        address: hotel.address,
        star: hotel.star,
        open_date: hotel.open_date ? parseDate(hotel.open_date) : null,
        tags: tagList,
        nearby: hotel.nearby || '',
      })
    } catch (error) {
      // 错误已在拦截器处理
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const cover_image = coverFileList[0]?.response?.data?.url || coverFileList[0]?.url || undefined
      const imageUrls = galleryFileList
        .map((f) => f.response?.data?.url || f.url)
        .filter(Boolean) as string[]

      const formData: HotelFormData = {
        name_cn: values.name_cn,
        name_en: values.name_en,
        address: values.address,
        star: values.star,
        open_date: values.open_date ? dayjs(values.open_date).format('YYYY-MM-DD') : undefined,
        cover_image,
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
        tags: (values.tags || []).join(',') || undefined,
        facilities: undefined,
        nearby: values.nearby?.trim() || undefined,
      }

      if (isEdit) {
        const res = await updateHotel(Number(id), formData)
        if (res.data?.data?.need_resubmit) {
          message.warning('保存成功，请重新提交审核')
        } else {
          message.success('更新成功')
        }
      } else {
        await createHotel(formData)
        message.success('创建成功')
      }

      navigate('/hotels')
    } catch (error) {
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card title={isEdit ? '编辑酒店' : '新建酒店'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ star: 3, tags: [] }}
        >
          <Form.Item
            name="name_cn"
            label="酒店中文名"
            rules={[{ required: true, message: '请输入酒店中文名' }]}
          >
            <Input placeholder="请输入酒店中文名" />
          </Form.Item>

          <Form.Item name="name_en" label="酒店英文名">
            <Input placeholder="请输入酒店英文名（可选）" />
          </Form.Item>

          <Form.Item
            name="address"
            label="酒店地址"
            rules={[{ required: true, message: '请输入酒店地址' }]}
          >
            <Input.TextArea rows={2} placeholder="请输入酒店地址" />
          </Form.Item>

          <Form.Item
            name="star"
            label="星级"
            rules={[{ required: true, message: '请选择星级' }]}
          >
            <InputNumber min={1} max={5} style={{ width: 120 }} />
          </Form.Item>

          <Form.Item name="open_date" label="开业日期">
            <DatePicker style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name="cover_image"
            label="封面图片"
            extra="用于列表页展示，建议尺寸 800×500"
          >
            <Upload
              action="/api/upload"
              headers={{ Authorization: `Bearer ${token}` }}
              listType="picture-card"
              fileList={coverFileList}
              maxCount={1}
              accept="image/*"
              onChange={({ fileList }) => setCoverFileList(fileList)}
            >
              {coverFileList.length < 1 && (
                <div><PlusOutlined /><div style={{ marginTop: 8 }}>上传封面</div></div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="图集（最多10张）"
            extra="用于详情页轮播展示"
          >
            <Upload
              action="/api/upload"
              headers={{ Authorization: `Bearer ${token}` }}
              listType="picture-card"
              fileList={galleryFileList}
              maxCount={10}
              accept="image/*"
              multiple
              onChange={({ fileList }) => setGalleryFileList(fileList)}
            >
              {galleryFileList.length < 10 && (
                <div><PlusOutlined /><div style={{ marginTop: 8 }}>上传图片</div></div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="tags" label="设施服务">
            <Checkbox.Group>
              <Space wrap>
                {HOTEL_TAGS.map((tag) => (
                  <Checkbox key={tag} value={tag}>
                    {tag}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="nearby" label="附近景点" extra="逗号分隔，如：故宫,天安门,王府井">
            <Input placeholder="故宫,天安门,王府井" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
              <Button onClick={() => navigate('/hotels')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {isEdit && <RoomManager hotelId={Number(id)} />}
      {isEdit && <PriceStrategyManager hotelId={Number(id)} />}
    </div>
  )
}
