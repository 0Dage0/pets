# 毛毛家宠物领养平台 - 部署指南

## 云端部署选项

### 选项 1: Render.com (推荐 - 免费)

1. **准备代码**
   - 将项目推送到 GitHub 仓库

2. **创建 PostgreSQL 数据库**
   - 登录 Render.com
   - Dashboard → New → PostgreSQL
   - 记下数据库连接信息

3. **创建 Web Service**
   - Dashboard → New → Web Service
   - 选择 GitHub 仓库
   - 设置:
     - Build Command: `mvn package -DskipTests`
     - Start Command: `java -jar target/pet-adoption-1.0.0.jar`
   - 添加环境变量:
     - `DB_URL`: `jdbc:postgresql://your-db-host:5432/pet_adoption`
     - `DB_USER`: your_db_user
     - `DB_PASSWORD`: your_db_password
     - `JWT_SECRET`: your-secret-key

---

### 选项 2: Railway (免费额度)

1. **部署 MySQL**
   - Railway Dashboard → New → Add Plugin → MySQL
   - 记下连接信息

2. **部署后端**
   - New → GitHub Repo
   - 选择后端代码
   - 设置环境变量同 Render

---

### 选项 3: 腾讯云/阿里云轻量服务器

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 2. 创建部署目录
mkdir -p /opt/pet-adoption
cd /opt/pet-adoption

# 3. 创建 docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: "3.8"

services:
  backend:
    image: your-registry/pet-adoption-backend:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/pet_adoption
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=root
      - JWT_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=pet_adoption
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
EOF

# 4. 启动
docker-compose up -d
```

---

### 选项 4: Cloudflare Tunnel (免费内网穿透)

如果你有本地服务器但想让外网访问:

1. 安装 cloudflared
2. 创建隧道:
```bash
cloudflared tunnel create pet-adoption
cloudflared tunnel url pet-adoption
```

---

## 前端部署

### 静态托管服务

**Netlify / Vercel (免费)**:
1. 将 `index.html`, `css/`, `js/` 上传
2. 或连接 GitHub 仓库自动部署

**修改 API 地址**:
在 `js/api.js` 中设置:
```javascript
baseURL: 'https://your-backend-url.onrender.com'
```

---

## 快速启动 (本地 Docker)

```bash
cd D:\Project\pets\backend
docker-compose up -d

# 等待启动完成后访问
# 后端: http://localhost:8080
# 前端: 打开 index.html 或 npx serve ../index.html
```

---

## 测试账号

注册新用户或使用演示账号:
- 手机: `13800000001` ~ `13800000005`
- 密码: `123456`
