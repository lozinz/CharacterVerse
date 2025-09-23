import React from 'react'
import { Card, Row, Col, Typography, Space, Divider } from 'antd'
import { BgColorsOutlined, SettingOutlined } from '@ant-design/icons'
import { PageContainer, ThemePreview } from '../../components'
import useThemeStore from '../../store/useThemeStore'
import './ThemeDemo.css'

const { Title, Paragraph, Text } = Typography

const ThemeDemo = () => {
  const { theme, customColors } = useThemeStore()

  return (
    <PageContainer>
      <div className="theme-demo-page">
        {/* 页面头部 */}
        <Card className="demo-header-card">
          <Row align="middle" gutter={[16, 16]}>
            <Col>
              <BgColorsOutlined className="demo-icon" />
            </Col>
            <Col flex="auto">
              <Title level={2} style={{ margin: 0 }}>
                主题控制系统演示
              </Title>
              <Paragraph style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
                体验完整的主题定制功能，包括亮色/暗色模式切换和自定义颜色配置
              </Paragraph>
            </Col>
          </Row>
        </Card>

        {/* 功能介绍 */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card 
              title="🌓 主题模式" 
              className="feature-card"
              hoverable
            >
              <Space direction="vertical">
                <Text>
                  支持亮色和暗色两种主题模式，可以根据用户偏好或系统设置自动切换。
                </Text>
                <Text type="secondary">
                  当前模式: <Text code>{theme === 'light' ? '亮色模式' : '暗色模式'}</Text>
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card 
              title="🎨 自定义颜色" 
              className="feature-card"
              hoverable
            >
              <Space direction="vertical">
                <Text>
                  提供完整的颜色自定义功能，包括主色调、成功色、警告色、错误色等。
                </Text>
                <Text type="secondary">
                  主色调: <Text code>{customColors.primary}</Text>
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card 
              title="🎯 预设主题" 
              className="feature-card"
              hoverable
            >
              <Space direction="vertical">
                <Text>
                  内置多种精美的预设主题，一键应用，快速切换不同的视觉风格。
                </Text>
                <Text type="secondary">
                  包含8种预设主题配色方案
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* 使用说明 */}
        <Card title="📖 使用说明" className="usage-card">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Title level={4}>
                <SettingOutlined /> 如何使用主题控制器
              </Title>
              <Space direction="vertical" size="middle">
                <div className="usage-step">
                  <Text strong>1. 打开主题设置</Text>
                  <Paragraph>
                    点击页面右上角的设置按钮 <SettingOutlined /> 打开主题控制面板
                  </Paragraph>
                </div>
                
                <div className="usage-step">
                  <Text strong>2. 切换主题模式</Text>
                  <Paragraph>
                    使用开关控件在亮色和暗色模式之间切换
                  </Paragraph>
                </div>
                
                <div className="usage-step">
                  <Text strong>3. 选择预设主题</Text>
                  <Paragraph>
                    从8种预设主题中选择您喜欢的配色方案
                  </Paragraph>
                </div>
                
                <div className="usage-step">
                  <Text strong>4. 自定义颜色</Text>
                  <Paragraph>
                    使用颜色选择器自定义各种状态颜色
                  </Paragraph>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={12}>
              <Title level={4}>🔧 高级功能</Title>
              <Space direction="vertical" size="middle">
                <div className="usage-step">
                  <Text strong>本地存储</Text>
                  <Paragraph>
                    主题设置会自动保存到本地存储，下次访问时会恢复您的设置
                  </Paragraph>
                </div>
                
                <div className="usage-step">
                  <Text strong>系统跟随</Text>
                  <Paragraph>
                    首次访问时会根据系统的深色模式偏好自动设置主题
                  </Paragraph>
                </div>
                
                <div className="usage-step">
                  <Text strong>实时预览</Text>
                  <Paragraph>
                    所有主题更改都会实时应用，无需刷新页面
                  </Paragraph>
                </div>
                
                <div className="usage-step">
                  <Text strong>重置功能</Text>
                  <Paragraph>
                    一键重置为默认主题设置
                  </Paragraph>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>

        <Divider />

        {/* 主题预览组件 */}
        <ThemePreview />
      </div>
    </PageContainer>
  )
}

export default ThemeDemo