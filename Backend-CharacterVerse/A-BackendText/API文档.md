# `/api/voiceTypes` API 文档

## 接口说明

获取系统中所有可用的声音类型及其详细信息。

### 请求信息

| 属性 | 值 |
|------|----|
| **请求方法** | `GET` |
| **请求路径** | `/api/voiceTypes` |
| **认证要求** | 无需认证 |

### 请求参数
无

### 响应格式
JSON 格式，包含以下字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `code` | int | 状态码 (200 表示成功) |
| `message` | string | 状态消息 ("success" 表示成功) |
| `data` | array | 声音类型列表 |

### `data` 数组中的对象结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `voice_type` | string | 声音类型标识符 (用于创建角色时指定音色) |
| `voice_name` | string | 声音类型的友好名称 |
| `category` | string | 声音分类 (如: "中文", "英文", "双语音色"等) |
| `sample_url` | string | 声音示例的音频文件 URL |

### 成功响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "voice_type": "qiniu_zh_female_wwxkjx",
      "voice_name": "温柔女声",
      "category": "中文",
      "sample_url": "https://aitoken-public.qnaigc.com/ai-voice/qiniu_zh_female_wwxkjx.mp3"
    },
    {
      "voice_type": "qiniu_zh_male_wwxkjx",
      "voice_name": "温柔男声",
      "category": "中文",
      "sample_url": "https://aitoken-public.qnaigc.com/ai-voice/qiniu_zh_male_wwxkjx.mp3"
    },
    {
      "voice_type": "qiniu_en_female_ysyyn",
      "voice_name": "英式英语女",
      "category": "双语音色",
      "sample_url": "https://aitoken-public.qnaigc.com/ai-voice/qiniu_en_female_ysyyn.mp3"
    }
  ]
}
```

### 错误响应示例

```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

## 使用场景

1. **创建角色时选择音色**：前端在创建角色表单中展示所有可用的声音类型供用户选择
2. **角色详情页展示音色信息**：展示角色当前使用的声音类型及其详细信息
3. **角色编辑时更换音色**：允许用户更换角色的声音类型

## 前端调用示例

```javascript
// 使用 fetch 调用
fetch('/api/voiceTypes')
  .then(response => response.json())
  .then(data => {
    if (data.code === 200) {
      console.log('获取到的声音类型:', data.data);
      // 在此处处理声音类型数据
    } else {
      console.error('获取声音类型失败:', data.message);
    }
  })
  .catch(error => console.error('请求失败:', error));

// 使用 axios 调用
axios.get('/api/voiceTypes')
  .then(response => {
    if (response.data.code === 200) {
      console.log('获取到的声音类型:', response.data.data);
      // 在此处处理声音类型数据
    } else {
      console.error('获取声音类型失败:', response.data.message);
    }
  })
  .catch(error => console.error('请求失败:', error));
```

## 注意事项

1. 该接口返回的声音类型列表是静态配置的，不会频繁变更
2. 建议前端在应用启动时调用一次并缓存结果，避免频繁请求
3. 每个声音类型的 `voice_type` 值在创建角色时需要传递给后端
4. `sample_url` 字段可用于前端播放声音示例


我们正在编写创建角色的API文档，该API的路径是`/api/user/addRole`，需要JWT认证，请求方法为POST。
 根据提供的代码，请求体是一个JSON对象，包含以下字段：
   - name: 角色名称（必填）
   - description: 角色描述（必填）
   - gender: 角色性别（必填）
   - age: 角色年龄（必填）
   - voice_type: 声音类型（必填）

 响应成功时，返回一个包含`role_id`的对象。

 下面我们编写简单明了的API文档，供前端开发者理解。

# `/api/user/addRole` API 文档

## 接口说明

创建新角色并将其关联到当前登录用户。

### 请求信息

| 属性 | 值 |
|------|----|
| **请求方法** | `POST` |
| **请求路径** | `/api/user/addRole` |
| **认证要求** | 需要有效的 JWT 令牌 (在 Authorization 头中) |

### 请求头

| 头名称 | 值 |
|--------|----|
| `Authorization` | `Bearer <your_jwt_token>` |
| `Content-Type` | `application/json` |

### 请求体 (JSON)

| 字段名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `name` | string | 是 | 角色名称 |
| `description` | string | 是 | 角色详细描述 |
| `gender` | string | 是 | 角色性别 (如: "男", "女", "其他") |
| `age` | int | 是 | 角色年龄 |
| `voice_type` | string | 是 | 声音类型标识符 (从 `/api/voiceTypes` 接口获取) |

### 请求示例

```json
{
  "name": "AI助手",
  "description": "一个乐于助人的AI助手，擅长解答各种技术问题",
  "gender": "男",
  "age": 25,
  "voice_type": "qiniu_zh_male_wwxkjx"
}
```

### 响应格式
JSON 格式，包含以下字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `code` | int | 状态码 (200 表示成功) |
| `message` | string | 状态消息 ("success" 表示成功) |
| `data` | object | 创建成功的角色信息 |

### `data` 对象结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `role_id` | uint | 新创建角色的唯一标识符 |

### 成功响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "role_id": 123
  }
}
```

### 错误响应示例

#### 认证失败 (401)
```json
{
  "code": 401,
  "message": "用户未认证",
  "data": null
}
```

#### 参数错误 (400)
```json
{
  "code": 400,
  "message": "参数错误: Key: 'AddRoleRequest.Name' Error:Field validation for 'Name' failed on the 'required' tag",
  "data": null
}
```

#### 服务器错误 (500)
```json
{
  "code": 500,
  "message": "数据库操作失败",
  "data": null
}
```

## 使用场景

1. **创建新角色**：用户创建自定义角色
2. **角色管理**：在用户角色列表中新增角色
3. **角色分享**：创建角色后可以分享给其他用户

## 前端调用示例

```javascript
// 使用 axios 调用
const createRole = async (roleData) => {
  try {
    const token = localStorage.getItem('jwt_token'); // 从本地存储获取 JWT
    const response = await axios.post('/api/user/addRole', roleData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.code === 200) {
      console.log('角色创建成功，ID:', response.data.data.role_id);
      return response.data.data.role_id;
    } else {
      console.error('角色创建失败:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;
  }
};

// 调用示例
const newRole = {
  name: "AI助手",
  description: "一个乐于助人的AI助手，擅长解答各种技术问题",
  gender: "男",
  age: 25,
  voice_type: "qiniu_zh_male_wwxkjx"
};

createRole(newRole).then(roleId => {
  if (roleId) {
    // 创建成功后的操作
    console.log("新角色ID:", roleId);
  }
});
```

## 注意事项

1. **认证要求**：必须提供有效的 JWT 令牌
2. **参数验证**：
   - 所有字段都是必填项
   - `age` 必须是正整数
   - `voice_type` 必须是有效的音色标识符
3. **角色数量限制**：每个用户最多可创建 50 个角色（根据业务规则）
4. **响应处理**：
   - 成功响应中包含新角色的 ID
   - 角色 ID 用于后续的角色管理操作（编辑、删除、对话等）
5. **错误处理**：
   - 400 错误通常表示参数缺失或格式错误
   - 401 错误表示认证失败或令牌过期
   - 500 错误表示服务器内部错误，需要联系管理员