# 毛毛家宠物领养平台

> 完整的宠物领养前后端分离项目

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (原生)
- **后端**: Java 17, Spring Boot 3.2
- **数据库**: MySQL 8.0 / PostgreSQL
- **认证**: JWT

## 快速开始

### 本地开发

1. **启动数据库**
```bash
# 使用 Docker
docker run -d --name pet-mysql \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=pet_adoption \
    -p 3306:3306 \
    mysql:8.0
```

2. **启动后端**
```bash
cd backend
mvn spring-boot:run
```

3. **启动前端**
直接用浏览器打开 `index.html`
或使用静态服务器:
```bash
npx serve .
```

### Docker 部署

```bash
cd backend
docker-compose up -d
```

## API 端点

| 模块 | 端点 | 方法 | 说明 |
|------|------|------|------|
| 认证 | `/api/auth/login` | POST | 登录 |
| 认证 | `/api/auth/register` | POST | 注册 |
| 宠物 | `/api/pets` | GET | 获取宠物列表 |
| 宠物 | `/api/pets/{id}` | GET | 获取宠物详情 |
| 宠物 | `/api/pets` | POST | 发布宠物 |
| 领养 | `/api/adoptions` | POST | 提交申请 |
| 消息 | `/api/conversations` | GET | 会话列表 |
| 消息 | `/api/messages` | POST | 发送消息 |
| 收藏 | `/api/favorites` | POST | 切换收藏 |

## 云端部署

详见 [backend/DEPLOY.md](backend/DEPLOY.md)

## 测试账号

- 手机: `13800000001` ~ `13800000005`
- 密码: `123456`

## 项目结构

```
pets/
├── backend/                 # Spring Boot 后端
│   ├── src/main/java/com/maomao/
│   │   ├── config/         # 配置
│   │   ├── controller/    # 控制器
│   │   ├── dto/          # 数据传输对象
│   │   ├── entity/       # 实体类
│   │   ├── repository/   # 数据访问层
│   │   └── service/      # 业务逻辑
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── js/                    # 前端 JavaScript
│   ├── api.js            # API 封装
│   ├── store.js          # 数据存储
│   ├── data.js           # 模拟数据
│   ├── app.js            # 应用入口
│   ├── components.js     # UI 组件
│   └── pages/           # 页面模块
│
├── css/                  # 样式
│   └── styles.css
│
└── index.html            # 入口页面
```

## License

MIT
