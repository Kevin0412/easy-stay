USE easy_stay;

-- 商户账号（密码: merchant123）
INSERT INTO users (username, password, email, phone, role) VALUES
('merchant1', '$2a$10$i6mRBBF6b8hR1q9ex3ttIOsrCF3UlW1agdR1.8TlzS5YAaV8JM8z6', 'merchant1@hotel.com', '13900139001', 'merchant');

-- 酒店数据（created_by=3 为 merchant1）
INSERT INTO hotels (name_cn, name_en, address, star, open_date, cover_image, images, status, tags, nearby, views, created_by) VALUES
(
  '北京王府半岛酒店',
  'The Peninsula Beijing',
  '北京市东城区金鱼胡同8号',
  5, '1989-03-15',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  '["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"]',
  'published',
  '豪华套房,免费停车,免费早餐,游泳池,健身房,SPA,会议室,洗衣服务,24小时前台,机场接送',
  '王府井步行街(0.3km),故宫(1.5km),天安门广场(2km)',
  1280, 3
),
(
  '上海外滩华尔道夫酒店',
  'Waldorf Astoria Shanghai on the Bund',
  '上海市黄浦区中山东一路2号',
  5, '2010-10-26',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
  '["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800","https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800","https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"]',
  'published',
  '豪华套房,江景/湖景,免费早餐,游泳池,健身房,SPA,会议室,24小时前台,机场接送,洗衣服务',
  '外滩(0.1km),南京东路(0.5km),豫园(2km),东方明珠(1.5km)',
  2350, 3
),
(
  '成都锦江宾馆',
  'Jinjiang Hotel Chengdu',
  '四川省成都市人民南路二段80号',
  4, '1963-10-01',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
  '["https://images.unsplash.com/photo-1455587734955-081b22074882?w=800","https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800"]',
  'published',
  '免费停车,亲子设施,免费早餐,停车场,健身房,会议室,24小时前台,洗衣服务',
  '天府广场(1km),宽窄巷子(3km),锦里(4km)',
  876, 3
),
(
  '杭州西子湖四季酒店',
  'Four Seasons Hotel Hangzhou at West Lake',
  '浙江省杭州市西湖区灵隐路5号',
  5, '2010-04-08',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
  '["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800","https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800","https://images.unsplash.com/photo-1533760881669-80db4d7b341c?w=800"]',
  'published',
  '豪华套房,江景/湖景,免费早餐,亲子设施,游泳池,健身房,SPA,会议室,24小时前台,机场接送,宠物友好',
  '西湖(0.2km),灵隐寺(1km),苏堤(1.5km),雷峰塔(3km)',
  1560, 3
),
(
  '三亚亚特兰蒂斯酒店',
  'Atlantis Sanya',
  '海南省三亚市天涯区红塘湾1号',
  5, '2018-04-28',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
  '["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800","https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"]',
  'pending',
  '豪华套房,亲子设施,免费早餐,江景/湖景,游泳池,健身房,SPA,机场接送,宠物友好',
  '大东海(5km),天涯海角(15km),蜈支洲岛(20km)',
  0, 3
);

-- 房型数据
INSERT INTO rooms (hotel_id, room_type, price, stock, max_guests, image) VALUES
(1, '豪华大床房', 1880.00, 10, 2, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'),
(1, '豪华双床房', 1980.00, 8,  2, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'),
(1, '行政套房',   3800.00, 4,  3, 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600'),
(1, '总统套房',   9800.00, 1,  4, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'),

(2, '外滩景观大床房', 2280.00, 12, 2, 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600'),
(2, '豪华双床房',     2180.00, 8,  2, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'),
(2, '豪华套房',       4500.00, 5,  3, 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600'),

(3, '标准大床房', 488.00, 20, 2, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'),
(3, '标准双床房', 518.00, 15, 2, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'),
(3, '商务套房',   888.00, 8,  2, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'),

(4, '湖景大床房',   2680.00, 10, 2, 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600'),
(4, '花园双床房',   2480.00, 8,  2, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'),
(4, '西湖景观套房', 5800.00, 4,  3, 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600'),

(5, '海景大床房', 2980.00, 15, 2, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'),
(5, '海景双床房', 2780.00, 10, 2, 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600'),
(5, '水上屋套房', 8800.00, 3,  3, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600');

-- 价格策略
INSERT INTO price_strategies (hotel_id, room_id, strategy_name, discount, start_date, end_date) VALUES
(1, NULL, '春节特惠',     0.90, '2026-01-28', '2026-02-28'),
(2, NULL, '情人节套餐',   0.88, '2026-02-13', '2026-02-28'),
(3, NULL, '工作日特惠',   0.85, '2026-02-24', '2026-03-31'),
(4, 11,   '湖景早鸟价',   0.80, '2026-02-24', '2026-03-15'),
(3, 8,    '标间限时折扣', 0.75, '2026-02-24', '2026-03-10');
