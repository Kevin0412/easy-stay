import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, InputNumber, DatePicker, Button, Card, message, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { getHotelById, createHotel, updateHotel, HotelFormData } from '@/services/hotel'
import RoomManager from './components/room-manager'
import styles from './index.module.scss'

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

      // images 是 JSON 字符串，解析为数组供 Form.List 使用
      let imageList: { url: string }[] = []
      if (hotel.images) {
        try {
          const parsed = JSON.parse(hotel.images)
          imageList = parsed.map((url: string) => ({ url }))
        } catch {}
      }

      form.setFieldsValue({
        name_cn: hotel.name_cn,
        name_en: hotel.name_en,
        address: hotel.address,
        star: hotel.star,
        open_date: hotel.open_date ? dayjs(hotel.open_date) : null,
        cover_image: hotel.cover_image || '',
        images: imageList,
        tags: hotel.tags || ''
      })
    } catch (error) {
      // 错误已在拦截器处理
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // 将图集数组序列化为 JSON 字符串
      const imageUrls = (values.images || [])
        .map((item: { url: string }) => item.url?.trim())
        .filter(Boolean)

      const formData: HotelFormData = {
        name_cn: values.name_cn,
        name_en: values.name_en,
        address: values.address,
        star: values.star,
        open_date: values.open_date ? dayjs(values.open_date).format('YYYY-MM-DD') : undefined,
        cover_image: values.cover_image?.trim() || undefined,
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : undefined,
        tags: values.tags?.trim() || undefined
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
          initialValues={{ star: 3 }}
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
            extra="填写封面图的完整 URL，用于列表页展示"
          >
            <Input placeholder="https://example.com/cover.jpg" />
          </Form.Item>

          <Form.Item label="图集（最多10张）" extra="填写每张图片的完整 URL，用于详情页轮播展示">
            <Form.List name="images">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'url']}
                        rules={[{ required: true, message: '请输入图片 URL 或删除此行' }]}
                        style={{ marginBottom: 0, flex: 1, minWidth: 400 }}
                      >
                        <Input placeholder={`图片 ${index + 1} URL`} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
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

          <Form.Item
            name="tags"
            label="标签"
            extra="多个标签用英文逗号分隔，例如：豪华套房,免费停车,亲子设施"
          >
            <Input placeholder="豪华套房,免费停车,亲子设施" />
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
    </div>
  )
}
