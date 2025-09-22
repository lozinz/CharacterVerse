import { useState, useRef, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Button, 
  Avatar, 
  List, 
  Typography, 
  Space, 
  Tag, 
  Empty,
  Divider,
  Tooltip
} from 'antd'
import { 
  SendOutlined, 
  UserOutlined, 
  RobotOutlined,
  DeleteOutlined,
  HistoryOutlined,
  MessageOutlined
} from '@ant-design/icons'
import PageContainer from '../../components/PageContainer'
import StatCard from '../../components/StatCard'

const { TextArea } = Input
const { Text, Title } = Typography

const Chat = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const characters = [
    {
      id: 1,
      name: '小助手',
      avatar: '🤖',
      personality: '友善、乐于助人',
      description: '一个贴心的AI助手，随时准备为您提供帮助和支持。',
      tags: ['助手', '友善', '智能'],
      online: true
    },
    {
      id: 2,
      name: '创意伙伴',
      avatar: '🎨',
      personality: '创意、活泼',
      description: '充满创意的伙伴，能够激发您的灵感，一起探索无限可能。',
      tags: ['创意', '灵感', '艺术'],
      online: true
    },
    {
      id: 3,
      name: '智慧导师',
      avatar: '📚',
      personality: '博学、耐心',
      description: '知识渊博的导师，耐心解答您的疑问，引导您学习成长。',
      tags: ['博学', '导师', '教育'],
      online: false
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character)
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: `你好！我是${character.name}，${character.description}`,
        timestamp: new Date().toLocaleTimeString()
      }
    ])
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedCharacter) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(() => {
      const aiResponses = {
        1: [ // 小助手
          '我很乐意帮助您！有什么我可以为您做的吗？',
          '这是一个很好的问题，让我来为您解答。',
          '我理解您的需求，让我们一起来解决这个问题。'
        ],
        2: [ // 创意伙伴
          '哇，这个想法很有趣！让我们一起发挥创意吧！',
          '我有一个很棒的创意想法要和您分享！',
          '让我们用不同的角度来看待这个问题，也许会有意想不到的收获！'
        ],
        3: [ // 智慧导师
          '这是一个值得深入思考的问题，让我为您详细分析。',
          '从学术角度来看，我们可以这样理解这个概念。',
          '让我引用一些相关的理论来帮助您更好地理解。'
        ]
      }

      const responses = aiResponses[selectedCharacter.id] || ['我明白了，让我想想如何回答您。']
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearMessages = () => {
    if (selectedCharacter) {
      setMessages([
        {
          id: 1,
          type: 'ai',
          content: `你好！我是${selectedCharacter.name}，${selectedCharacter.description}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ])
    }
  }

  const onlineCharacters = characters.filter(char => char.online)
  const totalMessages = messages.length

  return (
    <PageContainer
      title="智能聊天"
      description="与您的AI角色进行对话交流"
    >
      <Row gutter={[24, 24]} style={{ height: 'calc(100vh - 12rem)' }}>
        {/* 左侧角色列表 */}
        <Col xs={24} lg={8}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 统计信息 */}
            <div style={{ marginBottom: '1rem' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <StatCard
                    title="在线角色"
                    value={onlineCharacters.length}
                    suffix="个"
                    icon={<UserOutlined />}
                    size="small"
                  />
                </Col>
                <Col span={12}>
                  <StatCard
                    title="消息数"
                    value={totalMessages}
                    suffix="条"
                    icon={<MessageOutlined />}
                    size="small"
                  />
                </Col>
              </Row>
            </div>

            {/* 角色列表 */}
            <Card 
              title="选择聊天角色" 
              style={{ flex: 1, overflow: 'hidden' }}
              bodyStyle={{ padding: 0, height: 'calc(100% - 3rem)', overflow: 'auto' }}
            >
              <List
                dataSource={characters}
                renderItem={(character) => (
                  <List.Item
                    style={{
                      padding: '1rem',
                      cursor: 'pointer',
                      backgroundColor: selectedCharacter?.id === character.id ? '#f0f8ff' : 'transparent',
                      borderLeft: selectedCharacter?.id === character.id ? '3px solid #1890ff' : '3px solid transparent'
                    }}
                    onClick={() => handleCharacterSelect(character)}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{ position: 'relative' }}>
                          <Avatar size={48} style={{ fontSize: '1.5rem' }}>
                            {character.avatar}
                          </Avatar>
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: character.online ? '#52c41a' : '#d9d9d9',
                              border: '2px solid white'
                            }}
                          />
                        </div>
                      }
                      title={
                        <Space>
                          <Text strong>{character.name}</Text>
                          {!character.online && <Tag color="default">离线</Tag>}
                        </Space>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: '0.75rem' }}>
                            {character.personality}
                          </Text>
                          <div style={{ marginTop: '0.25rem' }}>
                            {character.tags.slice(0, 2).map(tag => (
                              <Tag key={tag} size="small" color="blue">
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Col>

        {/* 右侧聊天区域 */}
        <Col xs={24} lg={16}>
          <Card 
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {selectedCharacter ? (
              <>
                {/* 聊天头部 */}
                <div style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Space>
                    <Avatar size={40} style={{ fontSize: '1.25rem' }}>
                      {selectedCharacter.avatar}
                    </Avatar>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {selectedCharacter.name}
                      </Title>
                      <Text type="secondary" style={{ fontSize: '0.75rem' }}>
                        {selectedCharacter.personality}
                      </Text>
                    </div>
                  </Space>
                  <Space>
                    <Tooltip title="清空聊天记录">
                      <Button 
                        icon={<DeleteOutlined />} 
                        onClick={clearMessages}
                        type="text"
                      />
                    </Tooltip>
                  </Space>
                </div>

                {/* 消息列表 */}
                <div style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  overflow: 'auto',
                  backgroundColor: '#fafafa'
                }}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '1rem'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                          alignItems: 'flex-start',
                          gap: '0.5rem'
                        }}
                      >
                        <Avatar 
                          size={32}
                          icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                          style={{ 
                            backgroundColor: message.type === 'user' ? '#1890ff' : '#52c41a',
                            fontSize: '0.875rem'
                          }}
                        >
                          {message.type === 'ai' ? selectedCharacter.avatar : null}
                        </Avatar>
                        <div>
                          <div
                            style={{
                              padding: '0.75rem 1rem',
                              borderRadius: '1rem',
                              backgroundColor: message.type === 'user' ? '#1890ff' : 'white',
                              color: message.type === 'user' ? 'white' : 'black',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              wordBreak: 'break-word'
                            }}
                          >
                            {message.content}
                          </div>
                          <Text 
                            type="secondary" 
                            style={{ 
                              fontSize: '0.75rem',
                              marginTop: '0.25rem',
                              display: 'block',
                              textAlign: message.type === 'user' ? 'right' : 'left'
                            }}
                          >
                            {message.timestamp}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Avatar size={32} style={{ backgroundColor: '#52c41a', fontSize: '0.875rem' }}>
                        {selectedCharacter.avatar}
                      </Avatar>
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '1rem',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        <Text type="secondary">正在输入...</Text>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 输入区域 */}
                <div style={{ 
                  padding: '1rem', 
                  borderTop: '1px solid #f0f0f0',
                  backgroundColor: 'white'
                }}>
                  <Space.Compact style={{ width: '100%' }}>
                    <TextArea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`与 ${selectedCharacter.name} 对话...`}
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      style={{ resize: 'none' }}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      style={{ height: 'auto' }}
                    >
                      发送
                    </Button>
                  </Space.Compact>
                </div>
              </>
            ) : (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="请选择一个角色开始聊天"
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default Chat