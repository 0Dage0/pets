#!/bin/bash
# 快速启动脚本 (Linux/Mac/Windows with Git Bash)

echo "=== 毛毛家宠物领养平台 - 本地启动 ==="

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "错误: 请先安装 Java 17+"
    exit 1
fi

# 检查 Maven
if ! command -v mvn &> /dev/null; then
    echo "错误: 请先安装 Maven"
    exit 1
fi

echo "1. 启动 MySQL Docker 容器..."
docker run -d --name pet-mysql \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=pet_adoption \
    -p 3306:3306 \
    mysql:8.0

echo "2. 等待 MySQL 启动..."
sleep 10

echo "3. 启动后端服务..."
cd backend
mvn spring-boot:run

echo "=== 服务已启动 ==="
echo "后端: http://localhost:8080"
echo "前端: 打开 index.html"
