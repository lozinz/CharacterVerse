import React from 'react'
import { Card, Button, Space, Tag, Progress, Alert, Input, Switch } from 'antd'
import { 
  HeartOutlined, 
  StarOutlined, 
  LikeOutlined,
  UserOutlined,
  SettingOutlined 
} from '@ant-design/icons'
import useThemeStore from '../store/useThemeStore'
import './ThemePreview.css'

const ThemePreview = () => {
  const { customColors, theme } = useThemeStore()

  return (
    <div className="theme-preview-container">
      <Card 
        title="主题预览" 
        className="preview-card"
        extra={<SettingOutlined />}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 按钮预览 */}
          <div className="preview-section">
            <h4>按钮组件</h4>
            <Space wrap>
              <Button type="primary">主要按钮</Button>
              <Button>默认按钮</Button>
              <Button type="dashed">虚线按钮</Button>
              <Button type="text">文本按钮</Button>
              <Button type="link">链接按钮</Button>
            </Space>
          </div>

          {/* 状态按钮 */}
          <div className="preview-section">
            <h4>状态按钮</h4>
            <Space wrap>
              <Button type="primary" style={{ backgroundColor: customColors.success }}>
                成功
              </Button>
              <Button type="primary" style={{ backgroundColor: customColors.warning }}>
                警告
              </Button>
              <Button type="primary" style={{ backgroundColor: customColors.error }}>
                错误
              </Button>
              <Button type="primary" style={{ backgroundColor: customColors.info }}>
                信息
              </Button>
            </Space>
          </div>

          {/* 标签预览 */}
          <div className="preview-section">
            <h4>标签组件</h4>
            <Space wrap>
              <Tag color={customColors.primary}>主色标签</Tag>
              <Tag color={customColors.success}>成功标签</Tag>
              <Tag color={customColors.warning}>警告标签</Tag>
              <Tag color={customColors.error}>错误标签</Tag>
              <Tag color={customColors.info}>信息标签</Tag>
            </Space>
          </div>

          {/* 进度条预览 */}
          <div className="preview-section">
            <h4>进度条组件</h4>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Progress percent={30} strokeColor={customColors.primary} />
              <Progress percent={50} strokeColor={customColors.success} />
              <Progress percent={70} strokeColor={customColors.warning} />
              <Progress percent={90} strokeColor={customColors.error} />
            </Space>
          </div>

          {/* 警告框预览 */}
          <div className="preview-section">
            <h4>警告框组件</h4>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert message="这是一个信息提示" type="info" showIcon />
              <Alert message="这是一个成功提示" type="success" showIcon />
              <Alert message="这是一个警告提示" type="warning" showIcon />
              <Alert message="这是一个错误提示" type="error" showIcon />
            </Space>
          </div>

          {/* 输入框预览 */}
          <div className="preview-section">
            <h4>输入组件</h4>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input placeholder="请输入内容" prefix={<UserOutlined />} />
              <Input.Search placeholder="搜索内容" enterButton />
              <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
            </Space>
          </div>

          {/* 图标预览 */}
          <div className="preview-section">
            <h4>图标组件</h4>
            <Space size="large">
              <HeartOutlined style={{ fontSize: 24, color: customColors.error }} />
              <StarOutlined style={{ fontSize: 24, color: customColors.warning }} />
              <LikeOutlined style={{ fontSize: 24, color: customColors.primary }} />
              <UserOutlined style={{ fontSize: 24, color: customColors.success }} />
              <SettingOutlined style={{ fontSize: 24, color: customColors.info }} />
            </Space>
          </div>

          {/* 颜色面板 */}
          <div className="preview-section">
            <h4>主题颜色</h4>
            <div className="color-palette">
              <div className="color-item">
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: customColors.primary }}
                />
                <span>主色调</span>
                <code>{customColors.primary}</code>
              </div>
              <div className="color-item">
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: customColors.success }}
                />
                <span>成功色</span>
                <code>{customColors.success}</code>
              </div>
              <div className="color-item">
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: customColors.warning }}
                />
                <span>警告色</span>
                <code>{customColors.warning}</code>
              </div>
              <div className="color-item">
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: customColors.error }}
                />
                <span>错误色</span>
                <code>{customColors.error}</code>
              </div>
              <div className="color-item">
                <div 
                  className="color-swatch" 
                  style={{ backgroundColor: customColors.info }}
                />
                <span>信息色</span>
                <code>{customColors.info}</code>
              </div>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default ThemePreview