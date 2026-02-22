// Mock 数据存储
const mock_data = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: '$2a$10$i6mRBBF6b8hR1q9ex3ttIOsrCF3UlW1agdR1.8TlzS5YAaV8JM8z6', // admin123
      email: 'admin@example.com',
      phone: '13900000000',
      role: 'admin',
      created_at: new Date()
    },
    {
      id: 2,
      username: 'merchant1',
      password: '$2a$10$i6mRBBF6b8hR1q9ex3ttIOsrCF3UlW1agdR1.8TlzS5YAaV8JM8z6', // admin123
      email: 'merchant@example.com',
      phone: '13800000000',
      role: 'merchant',
      created_at: new Date()
    },
    {
      id: 3,
      username: 'testuser',
      password: '$2a$10$viNePCXbtDwYoTT.TDxUFONXJ7i5hNuDHyGEed0tcZ6iAE4sjkyoO', // user123
      email: 'test@example.com',
      phone: '13800138000',
      role: 'user',
      created_at: new Date()
    }
  ],
  hotels: [
    {
      id: 1,
      name_cn: '北京希尔顿酒店',
      name_en: 'Beijing Hilton Hotel',
      address: '北京市朝阳区建国路88号',
      star: 5,
      open_date: '2020-01-01',
      tags: '豪华套房,免费停车,健身中心',
      cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      name_cn: '西安豪庭大酒店（西工大长安校区店）',
      name_en: 'Xi\'an Haoting Hotel (NPU Chang\'an Campus)',
      address: '陕西西安长安区东大街道东大村东翔路1号',
      star: 3,
      open_date: '2020-01-01',
      tags: '免费停车,亲子设施',
      cover_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      name_cn: '上海外滩华尔道夫酒店',
      name_en: 'Waldorf Astoria Shanghai on the Bund',
      address: '上海市黄浦区中山东一路2号',
      star: 5,
      open_date: '2018-06-15',
      tags: '豪华套房,亲子设施,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      name_cn: '广州白天鹅宾馆',
      name_en: 'White Swan Hotel Guangzhou',
      address: '广州市沙面南街1号',
      star: 5,
      open_date: '2019-03-20',
      tags: '豪华套房,亲子设施',
      cover_image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      name_cn: '深圳瑞吉酒店',
      name_en: 'The St. Regis Shenzhen',
      address: '深圳市福田区深南大道5016号',
      star: 5,
      open_date: '2021-08-10',
      tags: '豪华套房,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
        'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 6,
      name_cn: '杭州西湖国宾馆',
      name_en: 'Hangzhou Xihu State Guesthouse',
      address: '杭州市西湖区杨公堤18号',
      star: 5,
      open_date: '2017-05-01',
      tags: '豪华套房,亲子设施,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
        'https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 7,
      name_cn: '成都香格里拉大酒店',
      name_en: 'Shangri-La Hotel Chengdu',
      address: '成都市锦江区滨江东路9号',
      star: 4,
      open_date: '2019-11-12',
      tags: '亲子设施,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800',
        'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 8,
      name_cn: '南京金陵饭店',
      name_en: 'Jinling Hotel Nanjing',
      address: '南京市鼓楼区汉中路2号',
      star: 4,
      open_date: '2018-09-25',
      tags: '豪华套房,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 9,
      name_cn: '苏州凯悦酒店',
      name_en: 'Hyatt Regency Suzhou',
      address: '苏州市工业园区苏州大道西158号',
      star: 4,
      open_date: '2020-07-18',
      tags: '亲子设施,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 10,
      name_cn: '厦门日航酒店',
      name_en: 'Hotel Nikko Xiamen',
      address: '厦门市思明区湖滨南路8号',
      star: 4,
      open_date: '2019-04-30',
      tags: '亲子设施,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1537726235470-8504e3beef77?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1537726235470-8504e3beef77?w=800',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 11,
      name_cn: '青岛海景花园大酒店',
      name_en: 'Qingdao Seaview Garden Hotel',
      address: '青岛市市南区南海路9号',
      star: 3,
      open_date: '2018-12-05',
      tags: '免费停车,亲子设施',
      cover_image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 12,
      name_cn: '武汉光谷希尔顿酒店',
      name_en: 'Hilton Wuhan Optics Valley',
      address: '武汉市洪山区珞喻路889号',
      star: 4,
      open_date: '2021-02-14',
      tags: '豪华套房,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 13,
      name_cn: '重庆解放碑威斯汀酒店',
      name_en: 'The Westin Chongqing Liberation Square',
      address: '重庆市渝中区邹容路68号',
      star: 5,
      open_date: '2020-10-01',
      tags: '豪华套房,亲子设施,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 14,
      name_cn: '长沙运达喜来登酒店',
      name_en: 'Sheraton Changsha Hotel',
      address: '长沙市开福区芙蓉中路一段478号',
      star: 4,
      open_date: '2019-06-20',
      tags: '亲子设施,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=800',
        'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 15,
      name_cn: '西安索菲特传奇酒店',
      name_en: 'Sofitel Legend People\'s Grand Hotel Xian',
      address: '西安市新城区东新街319号',
      star: 5,
      open_date: '2017-09-15',
      tags: '豪华套房,免费停车',
      cover_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
      ]),
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    }
  ],
  rooms: [
    // 北京希尔顿酒店
    {
      id: 1,
      hotel_id: 1,
      room_type: '豪华大床房',
      price: 888.00,
      stock: 10,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      hotel_id: 1,
      room_type: '行政套房',
      price: 1588.00,
      stock: 5,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 西安豪庭大酒店
    {
      id: 3,
      hotel_id: 2,
      room_type: '标准双床房',
      price: 288.00,
      stock: 20,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      hotel_id: 2,
      room_type: '商务大床房',
      price: 388.00,
      stock: 15,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 上海外滩华尔道夫酒店
    {
      id: 5,
      hotel_id: 3,
      room_type: '豪华江景房',
      price: 1888.00,
      stock: 8,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 6,
      hotel_id: 3,
      room_type: '总统套房',
      price: 8888.00,
      stock: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 广州白天鹅宾馆
    {
      id: 7,
      hotel_id: 4,
      room_type: '珠江景观房',
      price: 1288.00,
      stock: 12,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 8,
      hotel_id: 4,
      room_type: '行政楼层房',
      price: 1688.00,
      stock: 6,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 深圳瑞吉酒店
    {
      id: 9,
      hotel_id: 5,
      room_type: '瑞吉豪华房',
      price: 1588.00,
      stock: 10,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 10,
      hotel_id: 5,
      room_type: '瑞吉套房',
      price: 2888.00,
      stock: 4,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 杭州西湖国宾馆
    {
      id: 11,
      hotel_id: 6,
      room_type: '西湖景观房',
      price: 1388.00,
      stock: 15,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 12,
      hotel_id: 6,
      room_type: '园景别墅',
      price: 3888.00,
      stock: 3,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 成都香格里拉大酒店
    {
      id: 13,
      hotel_id: 7,
      room_type: '豪华房',
      price: 688.00,
      stock: 18,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 14,
      hotel_id: 7,
      room_type: '行政房',
      price: 988.00,
      stock: 10,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 南京金陵饭店
    {
      id: 15,
      hotel_id: 8,
      room_type: '高级房',
      price: 588.00,
      stock: 20,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 16,
      hotel_id: 8,
      room_type: '豪华套房',
      price: 1288.00,
      stock: 8,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 苏州凯悦酒店
    {
      id: 17,
      hotel_id: 9,
      room_type: '凯悦房',
      price: 788.00,
      stock: 16,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 18,
      hotel_id: 9,
      room_type: '君悦套房',
      price: 1588.00,
      stock: 6,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 厦门日航酒店
    {
      id: 19,
      hotel_id: 10,
      room_type: '海景房',
      price: 688.00,
      stock: 14,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 20,
      hotel_id: 10,
      room_type: '日航套房',
      price: 1388.00,
      stock: 5,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 青岛海景花园大酒店
    {
      id: 21,
      hotel_id: 11,
      room_type: '标准房',
      price: 388.00,
      stock: 25,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 22,
      hotel_id: 11,
      room_type: '海景房',
      price: 588.00,
      stock: 12,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 武汉光谷希尔顿酒店
    {
      id: 23,
      hotel_id: 12,
      room_type: '希尔顿客房',
      price: 688.00,
      stock: 18,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 24,
      hotel_id: 12,
      room_type: '行政套房',
      price: 1288.00,
      stock: 7,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 重庆解放碑威斯汀酒店
    {
      id: 25,
      hotel_id: 13,
      room_type: '威斯汀豪华房',
      price: 1088.00,
      stock: 15,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 26,
      hotel_id: 13,
      room_type: '威斯汀套房',
      price: 2088.00,
      stock: 5,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 长沙运达喜来登酒店
    {
      id: 27,
      hotel_id: 14,
      room_type: '喜来登豪华房',
      price: 688.00,
      stock: 20,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 28,
      hotel_id: 14,
      room_type: '行政楼层房',
      price: 988.00,
      stock: 10,
      created_at: new Date(),
      updated_at: new Date()
    },
    // 西安索菲特传奇酒店
    {
      id: 29,
      hotel_id: 15,
      room_type: '传奇豪华房',
      price: 1388.00,
      stock: 12,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 30,
      hotel_id: 15,
      room_type: '传奇套房',
      price: 2888.00,
      stock: 4,
      created_at: new Date(),
      updated_at: new Date()
    }
  ],
  price_strategies: [
    {
      id: 1,
      hotel_id: 1,
      room_id: 1,
      strategy_name: '春节优惠',
      discount: 0.8,
      start_date: '2026-02-01',
      end_date: '2026-02-28',
      created_at: new Date()
    },
    {
      id: 2,
      hotel_id: 3,
      room_id: 5,
      strategy_name: '周末特惠',
      discount: 0.85,
      start_date: '2026-02-01',
      end_date: '2026-03-31',
      created_at: new Date()
    },
    {
      id: 3,
      hotel_id: 5,
      room_id: 9,
      strategy_name: '情人节特惠',
      discount: 0.75,
      start_date: '2026-02-10',
      end_date: '2026-02-20',
      created_at: new Date()
    },
    {
      id: 4,
      hotel_id: 7,
      room_id: 13,
      strategy_name: '早鸟优惠',
      discount: 0.9,
      start_date: '2026-02-15',
      end_date: '2026-04-30',
      created_at: new Date()
    },
    {
      id: 5,
      hotel_id: 11,
      room_id: 21,
      strategy_name: '淡季促销',
      discount: 0.7,
      start_date: '2026-02-01',
      end_date: '2026-03-15',
      created_at: new Date()
    }
  ],
  favorites: [],
  orders: []
};

let next_id = {
  users: 4,
  hotels: 16,
  rooms: 31,
  price_strategies: 6,
  favorites: 1,
  orders: 1
};

// Mock query 函数
async function query(sql, params = []) {
  console.log('Mock Query:', sql, params);

  // SELECT 查询
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    if (sql.includes('FROM users')) {
      if (sql.includes('WHERE username')) {
        const username = params[0];
        const user = mock_data.users.find(u => u.username === username);
        return [[user].filter(Boolean), null];
      }
      if (sql.includes('WHERE id')) {
        const id = params[0];
        const user = mock_data.users.find(u => u.id === id);
        if (user) {
          const { password, ...user_without_password } = user;
          return [[user_without_password], null];
        }
        return [[], null];
      }
    }

    if (sql.includes('FROM hotels')) {
      let results = [...mock_data.hotels];

      if (sql.includes('WHERE id')) {
        const id = params[params.length - 1];
        results = results.filter(h => h.id === parseInt(id));
      } else {
        let param_index = 0;
        if (sql.includes('AND status')) {
          const status = params[param_index++];
          results = results.filter(h => h.status === status);
        }
        if (sql.includes('AND created_by')) {
          const created_by = params[param_index++];
          results = results.filter(h => h.created_by === created_by);
        }
        if (sql.includes('AND star')) {
          const star = params[param_index++];
          results = results.filter(h => h.star === parseInt(star));
        }
        if (sql.includes('AND (name_cn LIKE')) {
          const kw = params[param_index++].replace(/%/g, '');
          results = results.filter(h => h.name_cn.includes(kw) || h.address.includes(kw) || (h.tags && h.tags.includes(kw)));
        }
      }

      return [results, null];
    }

    if (sql.includes('FROM rooms')) {
      if (sql.includes('WHERE hotel_id')) {
        const hotel_id = params[0];
        const rooms = mock_data.rooms.filter(r => r.hotel_id === parseInt(hotel_id));
        return [rooms, null];
      }
      if (sql.includes('WHERE id')) {
        const id = params[0];
        const room = mock_data.rooms.find(r => r.id === parseInt(id));
        return [[room].filter(Boolean), null];
      }
    }

    if (sql.includes('FROM price_strategies')) {
      if (sql.includes('WHERE hotel_id')) {
        const hotel_id = params[0];
        const strategies = mock_data.price_strategies.filter(p => p.hotel_id === parseInt(hotel_id));
        return [strategies, null];
      }
      if (sql.includes('WHERE id')) {
        const id = params[0];
        const strategy = mock_data.price_strategies.find(p => p.id === parseInt(id));
        return [[strategy].filter(Boolean), null];
      }
      if (sql.includes('WHERE room_id')) {
        const room_id = params[0];
        const strategies = mock_data.price_strategies.filter(p => p.room_id === parseInt(room_id));
        return [strategies, null];
      }
    }

    if (sql.includes('FROM favorites')) {
      if (sql.includes('WHERE user_id') && sql.includes('hotel_id')) {
        const [user_id, hotel_id] = params;
        const rows = mock_data.favorites.filter(f => f.user_id === parseInt(user_id) && f.hotel_id === parseInt(hotel_id));
        return [rows, null];
      }
      if (sql.includes('JOIN hotels')) {
        const user_id = params[0];
        const rows = mock_data.favorites
          .filter(f => f.user_id === parseInt(user_id))
          .map(f => {
            const hotel = mock_data.hotels.find(h => h.id === f.hotel_id);
            return hotel ? { id: hotel.id, name_cn: hotel.name_cn, address: hotel.address, star: hotel.star, created_at: f.created_at } : null;
          })
          .filter(Boolean);
        return [rows, null];
      }
    }

    if (sql.includes('FROM orders')) {
      const user_id = params[0];
      const rows = mock_data.orders
        .filter(o => o.user_id === parseInt(user_id))
        .map(o => {
          const hotel = mock_data.hotels.find(h => h.id === o.hotel_id);
          const room = mock_data.rooms.find(r => r.id === o.room_id);
          return { ...o, hotel_name: hotel ? hotel.name_cn : '', room_type: room ? room.room_type : '' };
        });
      return [rows, null];
    }

    return [[], null];
  }

  // INSERT 查询
  if (sql.trim().toUpperCase().startsWith('INSERT')) {
    if (sql.includes('INTO users')) {
      const [username, password, role, email, phone] = params;
      const new_user = {
        id: next_id.users++,
        username,
        password,
        email: email || null,
        phone: phone || null,
        role: role || 'user',
        created_at: new Date()
      };
      mock_data.users.push(new_user);
      return [{ insertId: new_user.id }, null];
    }

    if (sql.includes('INTO hotels')) {
      const [name_cn, name_en, address, star, open_date, created_by, status] = params;
      const new_hotel = {
        id: next_id.hotels++,
        name_cn,
        name_en,
        address,
        star,
        open_date,
        created_by,
        status,
        created_at: new Date(),
        updated_at: new Date()
      };
      mock_data.hotels.push(new_hotel);
      return [{ insertId: new_hotel.id }, null];
    }

    if (sql.includes('INTO rooms')) {
      const [hotel_id, room_type, price, stock] = params;
      const new_room = {
        id: next_id.rooms++,
        hotel_id,
        room_type,
        price,
        stock,
        created_at: new Date(),
        updated_at: new Date()
      };
      mock_data.rooms.push(new_room);
      return [{ insertId: new_room.id }, null];
    }

    if (sql.includes('INTO price_strategies')) {
      const [hotel_id, room_id, strategy_name, discount, start_date, end_date] = params;
      const new_strategy = {
        id: next_id.price_strategies++,
        hotel_id,
        room_id,
        strategy_name,
        discount,
        start_date,
        end_date,
        created_at: new Date()
      };
      mock_data.price_strategies.push(new_strategy);
      return [{ insertId: new_strategy.id }, null];
    }

    if (sql.includes('INTO favorites') || sql.includes('IGNORE INTO favorites')) {
      const [user_id, hotel_id] = params;
      const exists = mock_data.favorites.find(f => f.user_id === parseInt(user_id) && f.hotel_id === parseInt(hotel_id));
      if (!exists) {
        const fav = { id: next_id.favorites++, user_id: parseInt(user_id), hotel_id: parseInt(hotel_id), created_at: new Date() };
        mock_data.favorites.push(fav);
        return [{ insertId: fav.id }, null];
      }
      return [{ insertId: 0 }, null];
    }

    if (sql.includes('INTO orders')) {
      const [user_id, hotel_id, room_id, check_in, check_out, nights, total_price, status] = params;
      const order = { id: next_id.orders++, user_id, hotel_id, room_id, check_in, check_out, nights, total_price, status, created_at: new Date() };
      mock_data.orders.push(order);
      return [{ insertId: order.id }, null];
    }
  }

  // UPDATE 查询
  if (sql.trim().toUpperCase().startsWith('UPDATE')) {
    if (sql.includes('hotels')) {
      const id = params[params.length - 1];
      const hotel = mock_data.hotels.find(h => h.id === parseInt(id));

      if (hotel) {
        if (sql.includes('SET status')) {
          hotel.status = params[0];
        } else {
          const [name_cn, name_en, address, star, open_date] = params;
          Object.assign(hotel, { name_cn, name_en, address, star, open_date, updated_at: new Date() });
        }
      }
      return [{ affectedRows: hotel ? 1 : 0 }, null];
    }

    if (sql.includes('rooms')) {
      const id = params[params.length - 1];
      const room = mock_data.rooms.find(r => r.id === parseInt(id));

      if (room) {
        const [room_type, price, stock] = params;
        Object.assign(room, { room_type, price, stock, updated_at: new Date() });
      }
      return [{ affectedRows: room ? 1 : 0 }, null];
    }

    if (sql.includes('price_strategies')) {
      const id = params[params.length - 1];
      const strategy = mock_data.price_strategies.find(p => p.id === parseInt(id));

      if (strategy) {
        const [strategy_name, discount, start_date, end_date] = params;
        Object.assign(strategy, { strategy_name, discount, start_date, end_date });
      }
      return [{ affectedRows: strategy ? 1 : 0 }, null];
    }
  }

  // DELETE 查询
  if (sql.trim().toUpperCase().startsWith('DELETE')) {
    const id = params[0];

    if (sql.includes('FROM hotels')) {
      const index = mock_data.hotels.findIndex(h => h.id === parseInt(id));
      if (index !== -1) {
        mock_data.hotels.splice(index, 1);
        return [{ affectedRows: 1 }, null];
      }
    }

    if (sql.includes('FROM rooms')) {
      const index = mock_data.rooms.findIndex(r => r.id === parseInt(id));
      if (index !== -1) {
        mock_data.rooms.splice(index, 1);
        return [{ affectedRows: 1 }, null];
      }
    }

    if (sql.includes('FROM price_strategies')) {
      const index = mock_data.price_strategies.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        mock_data.price_strategies.splice(index, 1);
        return [{ affectedRows: 1 }, null];
      }
    }

    if (sql.includes('FROM favorites')) {
      const [user_id, hotel_id] = params;
      const index = mock_data.favorites.findIndex(f => f.user_id === parseInt(user_id) && f.hotel_id === parseInt(hotel_id));
      if (index !== -1) {
        mock_data.favorites.splice(index, 1);
        return [{ affectedRows: 1 }, null];
      }
    }

    return [{ affectedRows: 0 }, null];
  }

  return [[], null];
}

module.exports = { query };
