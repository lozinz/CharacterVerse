# Utils 工具函数库

这个文件夹包含了项目中使用的各种工具函数，提供了SSE通信、HTTP请求、通用工具等功能。

## 📁 文件结构

```
utils/
├── sse.js          # SSE (Server-Sent Events) 工具
├── request.js      # HTTP请求工具
├── helpers.js      # 通用工具函数
├── index.js        # 统一导出
└── README.md       # 说明文档
```

## 🚀 SSE工具 (sse.js)

### 基础用法

```javascript
import { createSSEClient, connectSSE } from '@/utils/sse'

// 方式1: 创建SSE客户端
const client = createSSEClient()
await client.connect('/api/sse')

client.on('message', (data) => {
  console.log('收到消息:', data)
})

client.on('error', (error) => {
  console.error('连接错误:', error)
})

// 方式2: 简化连接
const client2 = await connectSSE('/api/sse', {
  onMessage: (data) => console.log('消息:', data),
  onError: (error) => console.error('错误:', error),
  onConnected: () => console.log('已连接'),
  onReconnecting: ({ attempt }) => console.log(`重连中 ${attempt}`)
})
```

### 聊天SSE客户端

```javascript
import { createChatSSEClient } from '@/utils/sse'

const chatClient = createChatSSEClient('chat123', 'user456')

// 连接到聊天服务器
await chatClient.connectToChat('/api/chat')

// 监听聊天消息
chatClient.onChatEvent('message', (data) => {
  console.log('新消息:', data.content)
})

// 监听输入状态
chatClient.onChatEvent('typing', (data) => {
  console.log(`${data.userId} 正在输入...`)
})

// 发送消息
await chatClient.sendMessage('Hello, World!')

// 发送输入状态
await chatClient.sendTypingStatus(true)
```

### SSE功能特性

- ✅ 自动重连（指数退避算法）
- ✅ 事件监听和管理
- ✅ 错误处理和恢复
- ✅ 连接状态监控
- ✅ 专门的聊天客户端
- ✅ 支持自定义事件类型
- ✅ 消息发送功能

## 🌐 HTTP请求工具 (request.js)

### 基础用法

```javascript
import { get, post, put, del, upload, download } from '@/utils/request'

// GET请求
const response = await get('/api/users', { page: 1, size: 10 })

// POST请求
const result = await post('/api/users', {
  name: 'John',
  email: 'john@example.com'
})

// 文件上传
const uploadResult = await upload('/api/upload', file)

// 文件下载
await download('/api/files/123', 'document.pdf')
```

### 请求拦截器

```javascript
import { addRequestInterceptor, addResponseInterceptor } from '@/utils/request'

// 添加认证头
addRequestInterceptor((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 处理响应错误
addResponseInterceptor((response) => {
  if (response.status === 401) {
    // 处理未授权
    window.location.href = '/login'
  }
  return response
})
```

### HTTP功能特性

- ✅ 基于fetch API
- ✅ 请求/响应拦截器
- ✅ 自动超时处理
- ✅ 错误处理和重试
- ✅ 文件上传/下载
- ✅ 自动JSON解析
- ✅ 支持FormData

## 🛠️ 通用工具 (helpers.js)

### 防抖和节流

```javascript
import { debounce, throttle } from '@/utils/helpers'

// 防抖搜索
const debouncedSearch = debounce((query) => {
  // 执行搜索
}, 300)

// 节流滚动
const throttledScroll = throttle(() => {
  // 处理滚动
}, 100)
```

### 时间格式化

```javascript
import { formatDate, getRelativeTime } from '@/utils/helpers'

const now = new Date()
console.log(formatDate(now, 'YYYY-MM-DD HH:mm:ss'))
console.log(getRelativeTime(now)) // "刚刚"
```

### 数据验证

```javascript
import { isValidEmail, isValidPhone, isValidURL } from '@/utils/helpers'

console.log(isValidEmail('test@example.com')) // true
console.log(isValidPhone('13800138000')) // true
console.log(isValidURL('https://example.com')) // true
```

### 本地存储

```javascript
import { storage } from '@/utils/helpers'

// 设置带过期时间的存储
storage.set('user', { name: 'John' }, 24 * 60 * 60 * 1000) // 24小时

// 获取存储
const user = storage.get('user')

// 删除存储
storage.remove('user')
```

### 其他实用功能

```javascript
import { 
  deepClone, 
  generateId, 
  formatFileSize, 
  copyToClipboard,
  isMobile,
  getDeviceType 
} from '@/utils/helpers'

// 深拷贝
const cloned = deepClone(originalObject)

// 生成ID
const id = generateId(12)

// 格式化文件大小
console.log(formatFileSize(1024)) // "1 KB"

// 复制到剪贴板
await copyToClipboard('Hello World')

// 设备检测
console.log(isMobile()) // true/false
console.log(getDeviceType()) // "mobile"/"tablet"/"desktop"
```

## 📦 统一导出 (index.js)

```javascript
// 导入所有工具
import * as utils from '@/utils'

// 或者按需导入
import { createSSEClient, get, debounce } from '@/utils'
```

## 🎯 在项目中的使用示例

### 聊天功能集成

```javascript
// 在聊天组件中使用SSE
import { createChatSSEClient } from '@/utils/sse'
import { post } from '@/utils/request'
import { debounce } from '@/utils/helpers'

const ChatComponent = () => {
  const [chatClient, setChatClient] = useState(null)
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    const initChat = async () => {
      const client = createChatSSEClient('chat123', 'user456')
      
      // 连接到聊天服务器
      await client.connectToChat()
      
      // 监听消息
      client.onChatEvent('message', (data) => {
        setMessages(prev => [...prev, data])
      })
      
      setChatClient(client)
    }
    
    initChat()
    
    return () => {
      chatClient?.disconnect()
    }
  }, [])
  
  // 防抖输入状态
  const debouncedTyping = debounce((isTyping) => {
    chatClient?.sendTypingStatus(isTyping)
  }, 300)
  
  const sendMessage = async (content) => {
    await chatClient.sendMessage(content)
  }
  
  return (
    // 聊天界面JSX
  )
}
```

### API请求集成

```javascript
// 在数据服务中使用HTTP工具
import { get, post, addRequestInterceptor } from '@/utils/request'
import { useAuthStore } from '@/store/useAuthStore'

// 添加认证拦截器
addRequestInterceptor((config) => {
  const { token } = useAuthStore.getState()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API服务
export const chatAPI = {
  getMessages: (chatId) => get(`/chat/${chatId}/messages`),
  sendMessage: (chatId, content) => post(`/chat/${chatId}/messages`, { content }),
  getCharacters: () => get('/characters'),
  createCharacter: (data) => post('/characters', data)
}
```

## 🔧 配置说明

### SSE配置

- `maxReconnectAttempts`: 最大重连次数（默认5次）
- `reconnectDelay`: 重连延迟（默认1000ms）
- `autoReconnect`: 是否自动重连（默认true）

### HTTP配置

- `timeout`: 请求超时时间（默认10000ms）
- `baseURL`: 基础URL（默认'/api'）
- `headers`: 默认请求头

## 🚨 注意事项

1. **SSE连接管理**: 记得在组件卸载时断开SSE连接
2. **内存泄漏**: 及时清理事件监听器和定时器
3. **错误处理**: 始终添加适当的错误处理逻辑
4. **网络状态**: 考虑网络断开和重连的情况
5. **性能优化**: 合理使用防抖和节流函数

## 📚 扩展建议

- 可以根据项目需求添加更多专用工具函数
- 考虑添加WebSocket工具作为SSE的补充
- 可以集成更多的数据验证和格式化函数
- 添加国际化相关的工具函数