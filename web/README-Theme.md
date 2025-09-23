# 主题控制系统使用文档

## 概述

本项目实现了一个完整的主题控制系统，支持亮色/暗色模式切换和自定义主题颜色配置。

## 功能特性

### 🌓 主题模式切换
- **亮色模式**: 适合白天使用的明亮界面
- **暗色模式**: 适合夜间使用的深色界面
- **系统跟随**: 首次访问时自动跟随系统偏好设置

### 🎨 自定义颜色
- **主色调**: 应用的主要品牌色
- **成功色**: 表示成功状态的颜色
- **警告色**: 表示警告状态的颜色
- **错误色**: 表示错误状态的颜色
- **信息色**: 表示信息提示的颜色

### 🎯 预设主题
内置8种精美的预设主题：
- 默认蓝 (#1890ff) - 经典蓝色主题
- 科技紫 (#722ed1) - 现代科技感
- 活力橙 (#fa8c16) - 充满活力
- 自然绿 (#52c41a) - 清新自然
- 热情红 (#f5222d) - 热情洋溢
- 优雅粉 (#eb2f96) - 优雅浪漫
- 深海蓝 (#13c2c2) - 深邃神秘
- 金色 (#faad14) - 尊贵典雅

## 使用方法

### 1. 基本使用

```jsx
import useThemeStore from '../store/useThemeStore'

function MyComponent() {
  const { theme, customColors, toggleTheme } = useThemeStore()
  
  return (
    <div>
      <p>当前主题: {theme}</p>
      <p>主色调: {customColors.primary}</p>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  )
}
```

### 2. 主题控制器组件

```jsx
import { ThemeController } from '../components'

function App() {
  return (
    <div>
      {/* 你的应用内容 */}
      <ThemeController />
    </div>
  )
}
```

### 3. 主题预览组件

```jsx
import { ThemePreview } from '../components'

function ThemePage() {
  return (
    <div>
      <h1>主题设置</h1>
      <ThemePreview />
    </div>
  )
}
```

## API 参考

### useThemeStore Hook

#### 状态属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `theme` | `'light' \| 'dark'` | 当前主题模式 |
| `customColors` | `Object` | 自定义颜色配置 |
| `presetColors` | `Array` | 预设主题颜色列表 |

#### 方法

| 方法 | 参数 | 描述 |
|------|------|------|
| `toggleTheme()` | - | 切换主题模式 |
| `setTheme(theme)` | `theme: string` | 设置主题模式 |
| `setCustomColor(type, color)` | `type: string, color: string` | 设置单个自定义颜色 |
| `setCustomColors(colors)` | `colors: Object` | 批量设置自定义颜色 |
| `applyPresetTheme(primaryColor)` | `primaryColor: string` | 应用预设主题 |
| `resetToDefault()` | - | 重置为默认主题 |
| `saveThemeToLocal()` | - | 保存主题到本地存储 |
| `loadThemeFromLocal()` | - | 从本地存储加载主题 |
| `exportTheme()` | - | 导出主题配置 |
| `importTheme(config)` | `config: Object` | 导入主题配置 |
| `initTheme()` | - | 初始化主题系统 |

### 自定义颜色对象结构

```javascript
{
  primary: '#1890ff',    // 主色调
  success: '#52c41a',    // 成功色
  warning: '#faad14',    // 警告色
  error: '#ff4d4f',      // 错误色
  info: '#1890ff'        // 信息色
}
```

## CSS 变量

主题系统会自动更新以下CSS变量：

### 颜色变量
```css
--primary-color: #1890ff;
--primary-hover: #40a9ff;
--primary-active: #096dd9;
--primary-light: #e6f7ff;

--success-color: #52c41a;
--success-hover: #73d13d;
--success-active: #389e0d;
--success-light: #f6ffed;

/* 其他颜色变量... */
```

### 主题模式变量
```css
/* 亮色模式 */
:root {
  --text-primary: rgba(0, 0, 0, 0.85);
  --bg-primary: #ffffff;
  --border-primary: #d9d9d9;
}

/* 暗色模式 */
[data-theme="dark"] {
  --text-primary: rgba(255, 255, 255, 0.85);
  --bg-primary: #141414;
  --border-primary: #434343;
}
```

## 自定义样式

### 使用CSS变量

```css
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  transition: all var(--animation-duration-base) var(--ease-out);
}

.my-button {
  background: var(--primary-color);
  color: white;
}

.my-button:hover {
  background: var(--primary-hover);
}
```

### 主题适配

```css
/* 通用样式 */
.my-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-secondary);
}

/* 暗色主题特殊样式 */
[data-theme="dark"] .my-card {
  box-shadow: var(--shadow-card);
}
```

## 最佳实践

### 1. 初始化主题
在应用启动时调用 `initTheme()` 方法：

```jsx
import { useEffect } from 'react'
import useThemeStore from './store/useThemeStore'

function App() {
  const { initTheme } = useThemeStore()
  
  useEffect(() => {
    initTheme()
  }, [])
  
  return <div>...</div>
}
```

### 2. 响应式设计
确保主题在不同设备上都能正常工作：

```css
@media (max-width: 768px) {
  .theme-controller-trigger {
    width: 44px;
    height: 44px;
  }
}
```

### 3. 性能优化
使用CSS变量而不是内联样式：

```jsx
// ✅ 推荐
<div className="my-component" />

// ❌ 不推荐
<div style={{ color: customColors.primary }} />
```

### 4. 无障碍访问
确保主题切换不影响可访问性：

```jsx
<button 
  onClick={toggleTheme}
  aria-label={`切换到${theme === 'light' ? '暗色' : '亮色'}模式`}
>
  {theme === 'light' ? '🌙' : '☀️'}
</button>
```

## 故障排除

### 主题不生效
1. 检查是否调用了 `initTheme()`
2. 确认CSS变量是否正确定义
3. 检查浏览器控制台是否有错误

### 颜色不更新
1. 确认调用了 `updateCSSVariables()`
2. 检查颜色值格式是否正确（需要十六进制格式）

### 本地存储问题
1. 检查浏览器是否支持localStorage
2. 确认没有隐私模式限制

## 扩展功能

### 添加新的预设主题
```javascript
const newPreset = {
  name: '自定义主题',
  primary: '#your-color',
  description: '描述信息'
}

// 在useThemeStore中添加到presetColors数组
```

### 自定义颜色生成算法
```javascript
// 在useThemeStore中修改lightenColor和darkenColor方法
lightenColor: (color, percent) => {
  // 你的自定义算法
}
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持亮色/暗色模式切换
- 支持自定义颜色配置
- 内置8种预设主题
- 本地存储支持
- 完整的CSS变量系统