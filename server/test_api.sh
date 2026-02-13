#!/bin/bash

# 易宿酒店预订平台 - API 测试脚本

BASE_URL="http://localhost:3000"
TOKEN=""

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "易宿酒店预订平台 - API 测试"
echo "=========================================="
echo ""

# 1. 健康检查
echo -e "${YELLOW}[1] 测试健康检查${NC}"
curl -s -X GET "$BASE_URL/health" | jq '.'
echo ""

# 2. 用户登录（管理员）
echo -e "${YELLOW}[2] 测试管理员登录${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
echo -e "${GREEN}Token: $TOKEN${NC}"
echo ""

# 3. 用户注册
echo -e "${YELLOW}[3] 测试用户注册${NC}"
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"test_merchant","password":"test123","role":"merchant"}' | jq '.'
echo ""

# 4. 获取酒店列表
echo -e "${YELLOW}[4] 测试获取酒店列表${NC}"
curl -s -X GET "$BASE_URL/api/hotels" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 5. 创建酒店
echo -e "${YELLOW}[5] 测试创建酒店${NC}"
CREATE_HOTEL_RESPONSE=$(curl -s -X POST "$BASE_URL/api/hotels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name_cn": "测试酒店",
    "name_en": "Test Hotel",
    "address": "测试地址123号",
    "star": 4,
    "open_date": "2026-01-01"
  }')

echo "$CREATE_HOTEL_RESPONSE" | jq '.'
HOTEL_ID=$(echo "$CREATE_HOTEL_RESPONSE" | jq -r '.data.hotel_id')
echo -e "${GREEN}创建的酒店 ID: $HOTEL_ID${NC}"
echo ""

# 6. 获取酒店详情
echo -e "${YELLOW}[6] 测试获取酒店详情${NC}"
curl -s -X GET "$BASE_URL/api/hotels/$HOTEL_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 7. 更新酒店信息
echo -e "${YELLOW}[7] 测试更新酒店信息${NC}"
curl -s -X PUT "$BASE_URL/api/hotels/$HOTEL_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name_cn": "测试酒店（已更新）",
    "name_en": "Test Hotel (Updated)",
    "address": "测试地址456号",
    "star": 5,
    "open_date": "2026-01-01"
  }' | jq '.'
echo ""

# 8. 创建房型
echo -e "${YELLOW}[8] 测试创建房型${NC}"
CREATE_ROOM_RESPONSE=$(curl -s -X POST "$BASE_URL/api/rooms" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"hotel_id\": $HOTEL_ID,
    \"room_type\": \"标准双人间\",
    \"price\": 299.00,
    \"stock\": 20
  }")

echo "$CREATE_ROOM_RESPONSE" | jq '.'
ROOM_ID=$(echo "$CREATE_ROOM_RESPONSE" | jq -r '.data.room_id')
echo -e "${GREEN}创建的房型 ID: $ROOM_ID${NC}"
echo ""

# 9. 获取酒店的所有房型
echo -e "${YELLOW}[9] 测试获取酒店房型列表${NC}"
curl -s -X GET "$BASE_URL/api/rooms/hotel/$HOTEL_ID" | jq '.'
echo ""

# 10. 创建价格策略
echo -e "${YELLOW}[10] 测试创建价格策略${NC}"
CREATE_PRICE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/prices" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"hotel_id\": $HOTEL_ID,
    \"room_id\": $ROOM_ID,
    \"strategy_name\": \"周末特惠\",
    \"discount\": 0.85,
    \"start_date\": \"2026-03-01\",
    \"end_date\": \"2026-03-31\"
  }")

echo "$CREATE_PRICE_RESPONSE" | jq '.'
STRATEGY_ID=$(echo "$CREATE_PRICE_RESPONSE" | jq -r '.data.strategy_id')
echo -e "${GREEN}创建的价格策略 ID: $STRATEGY_ID${NC}"
echo ""

# 11. 获取价格策略
echo -e "${YELLOW}[11] 测试获取价格策略${NC}"
curl -s -X GET "$BASE_URL/api/prices/hotel/$HOTEL_ID" | jq '.'
echo ""

# 12. 计算价格
echo -e "${YELLOW}[12] 测试价格计算${NC}"
curl -s -X GET "$BASE_URL/api/prices/calculate?room_id=$ROOM_ID&start_date=2026-03-10&end_date=2026-03-15" | jq '.'
echo ""

# 13. 提交审核
echo -e "${YELLOW}[13] 测试提交审核${NC}"
curl -s -X POST "$BASE_URL/api/hotels/$HOTEL_ID/publish" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 14. 审核通过
echo -e "${YELLOW}[14] 测试审核通过（管理员）${NC}"
curl -s -X POST "$BASE_URL/api/hotels/$HOTEL_ID/approve" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 15. 下线酒店
echo -e "${YELLOW}[15] 测试下线酒店（管理员）${NC}"
curl -s -X POST "$BASE_URL/api/hotels/$HOTEL_ID/offline" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 16. 删除价格策略
echo -e "${YELLOW}[16] 测试删除价格策略${NC}"
curl -s -X DELETE "$BASE_URL/api/prices/$STRATEGY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 17. 删除房型
echo -e "${YELLOW}[17] 测试删除房型${NC}"
curl -s -X DELETE "$BASE_URL/api/rooms/$ROOM_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 18. 删除酒店
echo -e "${YELLOW}[18] 测试删除酒店${NC}"
curl -s -X DELETE "$BASE_URL/api/hotels/$HOTEL_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "=========================================="
echo -e "${GREEN}测试完成！${NC}"
echo "=========================================="
