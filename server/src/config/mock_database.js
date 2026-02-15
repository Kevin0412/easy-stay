// Mock 数据存储
const mock_data = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: '$2a$10$i6mRBBF6b8hR1q9ex3ttIOsrCF3UlW1agdR1.8TlzS5YAaV8JM8z6', // admin123
      role: 'admin',
      created_at: new Date()
    },
    {
      id: 2,
      username: 'merchant1',
      password: '$2a$10$i6mRBBF6b8hR1q9ex3ttIOsrCF3UlW1agdR1.8TlzS5YAaV8JM8z6', // admin123
      role: 'merchant',
      created_at: new Date()
    }
  ],
  hotels: [
    {
      id: 1,
      name_cn: '北京希尔顿酒店',
      name_en: 'Beijing Hilton Hotel',
      address: '北京市朝阳区建国路',
      star: 5,
      open_date: '2020-01-01',
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
      status: 'published',
      created_by: 2,
      created_at: new Date(),
      updated_at: new Date()
    }
  ],
  rooms: [
    {
      id: 1,
      hotel_id: 1,
      room_type: '豪华大床房',
      price: 888.00,
      stock: 10,
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
    }
  ]
};

let next_id = {
  users: 3,
  hotels: 2,
  rooms: 2,
  price_strategies: 2
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

    return [[], null];
  }

  // INSERT 查询
  if (sql.trim().toUpperCase().startsWith('INSERT')) {
    if (sql.includes('INTO users')) {
      const [username, password, role] = params;
      const new_user = {
        id: next_id.users++,
        username,
        password,
        role,
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

    return [{ affectedRows: 0 }, null];
  }

  return [[], null];
}

module.exports = { query };
