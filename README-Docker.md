# CharacterVerse-AI Docker 部署指南

## 🚀 快速启动

### 前置要求
- Docker Desktop (推荐最新版本)
- Docker Compose (通常包含在Docker Desktop中)
- 至少 4GB 可用内存
- 至少 10GB 可用磁盘空间

### 一键启动
```bash
# 克隆项目后，在项目根目录执行
docker-compose up -d --build
```

### 访问应用
- **前端应用**: http://localhost
- **API接口**: http://localhost/api
- **健康检查**: http://localhost/health
- **数据库**: localhost:3306

## 📋 服务架构

```
用户请求 → Nginx (80端口) → 前端(5173) / 后端API(8080)
                           ↓
                      MySQL数据库(3306)
```

### 服务组件
| 服务 | 容器名 | 端口 | 功能 |
|------|--------|------|------|
| Nginx | characterverse-nginx | 80, 443 | 反向代理、负载均衡 |
| 前端 | characterverse-frontend | 5173 (内部) | React应用 |
| 后端 | characterverse-backend | 8080 (内部) | Go API服务 |
| 数据库 | characterverse-mysql | 3306 | MySQL数据存储 |

## 🛠️ 常用命令

### 启动服务
```bash
# 启动所有服务
docker-compose up -d

# 重新构建并启动
docker-compose up -d --build

# 启动特定服务
docker-compose up -d nginx frontend
```

### 停止服务
```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（谨慎使用）
docker-compose down -v
```

### 查看状态
```bash
# 查看所有服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f [服务名]

# 查看特定服务日志
docker logs characterverse-nginx --tail 50
```

### 重启服务
```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart nginx
```

## 🔧 开发模式

### 热重载功能
- **前端热重载**: 修改 `web/` 目录下的代码，浏览器自动刷新
- **后端热重载**: 修改 `Backend-CharacterVerse/` 目录下的Go代码，服务自动重启

### 实时代码同步
项目使用Docker卷挂载实现实时代码同步：
```yaml
volumes:
  # 前端代码同步
  - ./web:/app
  - /app/node_modules
  
  # 后端代码同步  
  - ./Backend-CharacterVerse:/app
  - /app/tmp
```

### 开发调试
```bash
# 进入容器调试
docker exec -it characterverse-backend sh
docker exec -it characterverse-frontend sh

# 查看容器内部文件
docker exec characterverse-backend ls -la /app
```

## 🗄️ 数据库管理

### 连接信息
- **主机**: localhost
- **端口**: 3306
- **用户名**: root
- **密码**: 123456
- **数据库**: character_verse

### 数据持久化
数据库数据通过Docker卷持久化存储：
```bash
# 查看数据卷
docker volume ls | grep mysql

# 备份数据库
docker exec characterverse-mysql mysqldump -uroot -p123456 character_verse > backup.sql

# 恢复数据库
docker exec -i characterverse-mysql mysql -uroot -p123456 character_verse < backup.sql
```

## 🔍 故障排除

### 常见问题

#### 1. 端口占用
```bash
# 检查端口占用
lsof -i :80
lsof -i :3306

# 解决方案：停止占用端口的进程或修改docker-compose.yml中的端口映射
```

#### 2. 容器启动失败
```bash
# 查看详细错误日志
docker-compose logs [服务名]

# 重新构建镜像
docker-compose build --no-cache [服务名]
```

#### 3. Nginx配置错误
```bash
# 测试Nginx配置
docker exec characterverse-nginx nginx -t

# 重新加载配置
docker exec characterverse-nginx nginx -s reload
```

#### 4. 数据库连接失败
```bash
# 检查MySQL服务状态
docker exec characterverse-mysql mysqladmin -uroot -p123456 ping

# 查看数据库日志
docker logs characterverse-mysql --tail 50
```

#### 5. 前端访问404
```bash
# 检查前端服务状态
curl -I http://localhost

# 检查Nginx代理配置
docker exec characterverse-nginx cat /etc/nginx/conf.d/default.conf
```

### 性能优化

#### 内存使用
```bash
# 查看容器资源使用
docker stats

# 限制容器内存使用（在docker-compose.yml中添加）
deploy:
  resources:
    limits:
      memory: 512M
```

#### 磁盘空间
```bash
# 清理未使用的镜像和容器
docker system prune -a

# 查看磁盘使用
docker system df
```

## 🔒 安全配置

### 生产环境建议
1. **修改默认密码**
   ```yaml
   environment:
     MYSQL_ROOT_PASSWORD: your_secure_password
   ```

2. **启用HTTPS**
   - 将SSL证书放入 `nginx/ssl/` 目录
   - 更新 `nginx/conf.d/default.conf` 添加SSL配置

3. **网络隔离**
   ```yaml
   networks:
     frontend:
       driver: bridge
     backend:
       driver: bridge
       internal: true
   ```

## 📝 配置文件说明

### docker-compose.yml
主要的Docker编排配置文件，定义了所有服务的配置。

### nginx/nginx.conf
Nginx主配置文件，包含全局设置和性能优化。

### nginx/conf.d/default.conf
站点特定配置，包含反向代理规则和路由配置。

### Backend-CharacterVerse/.air.toml
Go应用热重载配置文件。

## 🚀 部署到生产环境

### 环境变量配置
创建 `.env` 文件：
```env
# 数据库配置
DB_PASSWORD=your_production_password
JWT_SECRET=your_jwt_secret

# API配置
QINIU_API_KEY=your_api_key
QINIU_MODEL_NAME=your_model_name
```

### 生产环境启动
```bash
# 使用生产配置
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📞 技术支持

如果遇到问题，请按以下步骤排查：

1. **检查服务状态**: `docker-compose ps`
2. **查看日志**: `docker-compose logs -f`
3. **测试网络连接**: `curl -I http://localhost/health`
4. **检查资源使用**: `docker stats`

### 日志收集
```bash
# 收集所有服务日志
mkdir -p logs
docker-compose logs nginx > logs/nginx.log
docker-compose logs frontend > logs/frontend.log
docker-compose logs backend > logs/backend.log
docker-compose logs mysql > logs/mysql.log
```

---

## 🎉 享受开发！

现在您拥有了一个完整的、生产级别的Docker化开发环境！

- ✅ 统一的访问入口
- ✅ 自动热重载
- ✅ 数据持久化
- ✅ 性能优化
- ✅ 安全防护

Happy Coding! 🚀