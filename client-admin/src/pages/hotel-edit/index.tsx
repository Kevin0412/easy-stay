import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, InputNumber, DatePicker, Button, Card, message, Space, Checkbox } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { getHotelById, createHotel, updateHotel, HotelFormData } from '@/services/hotel'
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

/** 图片 URL 输入框，带实时预览 */
function ImageInput({
  value,
  onChange,
  placeholder,
}: {
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <img
          src={value}
          alt="预览"
          style={{
            display: 'block',
            marginTop: 6,
            maxHeight: 100,
            maxWidth: 240,
            objectFit: 'cover',
            borderRadius: 4,
            border: '1px solid #f0f0f0',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
          onLoad={(e) => {
            e.currentTarget.style.display = 'block'
          }}
        />
      )}
    </div>
  )
}

export default function HotelEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      loadHotel()
    }
  }, [id])

  const loadHotel = async () => {
    try {
      const res = await getHotelById(Number(id))
      const hotel = res.data.data

      let imageList: { url: string }[] = []
      if (hotel.images) {
        try {
          const parsed = JSON.parse(hotel.images)
          imageList = parsed.map((url: string) => ({ url }))
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
        cover_image: hotel.cover_image || '',
        images: imageList,
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
      const imageUrls = (values.images || [])
        .map((item: { url: string }) => item.url?.trim())
        .filter(Boolean)

      // tags 数组转回逗号分隔字符串
      const tagsStr = (values.tags || []).join(',') || undefined

      const formData: HotelFormData = {
        name_cn: values.name_cn,
        name_en: values.name_en,
        address: values.address,
        star: values.star,
        open_date: values.open_date ? dayjs(values.open_date).format('YYYY-MM-DD') : undefined,
        cover_image: values.cover_image?.trim() || undefined,
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
        tags: tagsStr,
        facilities: undefined,
        nearby: values.nearby?.trim() || undefined,
      }

      if (isEdit) {
        await updateHotel(Number(id), formData)
        message.success('更新成功')
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
            label="封面图片 URL"
            extra="用于列表页展示，输入 URL 后实时预览"
          >
            <ImageInput placeholder="https://example.com/cover.jpg" />
          </Form.Item>

          <Form.Item
            label="图集（最多10张）"
            extra="用于详情页轮播展示，输入 URL 后实时预览"
          >
            <Form.List name="images">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space
                      key={field.key}
                      align="start"
                      style={{ display: 'flex', marginBottom: 12 }}
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, 'url']}
                        rules={[{ required: true, message: '请输入图片 URL 或删除此行' }]}
                        style={{ marginBottom: 0, minWidth: 420 }}
                      >
                        <ImageInput placeholder={`图片 ${index + 1} URL`} />
                      </Form.Item>
                      <MinusCircleOutlined
                        style={{ marginTop: 8, color: '#ff4d4f' }}
                        onClick={() => remove(field.name)}
                      />
                    </Space>
                  ))}
                  {fields.length < 10 && (
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      添加图片
                    </Button>
                  )}
                </>
              )}
            </Form.List>
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
