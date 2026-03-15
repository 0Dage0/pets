# Render.com 部署指南

## 步骤 1: 推送代码到 GitHub

```bash
cd D:\Project\pets

# 初始化 git (如果没有)
git init
git add .
git commit -m "Add Spring Boot backend"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/你的用户名/pet-adoption.git
git push -u origin main
```

## 步骤 2: 创建 PostgreSQL 数据库

1. 打开 https://dashboard.render.com
2. 点击 "New" → "PostgreSQL"
3. 设置:
   - Name: `pet-adoption-db`
   - Database: `pet_adoption`
   - User: `pet_user`
4. 点击 "Create Database"
5. 等待创建完成后，点击 "Connect" 复制连接信息

## 步骤 3: 创建 Web Service

1. 点击 "New" → "Web Service"
2. 选择你的 GitHub 仓库
3. 设置:
   - Name: `pet-adoption-backend`
   - Branch: `main`
   - Runtime: `Java 17`
   - Build Command: `mvn package -DskipTests`
   - Start Command: `java -jar target/pet-adoption-1.0.0.jar`
4. 点击 "Advanced" 添加环境变量:

```
DB_URL=jdbc:postgresql://your-db-host:5432/pet_adoption
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=maomao-pet-secret-key-change-in-production-2024
CORS_ORIGINS=*
```

5. 点击 "Create Web Service"

## 步骤 4: 等待部署

- 首次部署需要 3-5 分钟
- 部署成功后，会得到一个 URL 如: `https://pet-adoption-backend.onrender.com`

## 步骤 5: 更新前端 API 地址

部署完成后，编辑 `js/api.js`:

```javascript
baseURL: 'https://你的-backend-url.onrender.com'
```

然后将前端文件部署到 Netlify/Vercel 或托管到任意静态服务器。

---

## 测试

部署完成后测试:
- `https://your-backend.onrender.com/api/pets` (应返回宠物列表)
- `https://your-backend.onrender.com/api/auth/register` (测试注册)
