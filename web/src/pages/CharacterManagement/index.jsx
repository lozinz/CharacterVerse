import { useState } from 'react'
import { Row, Col, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  HeartOutlined,
  StarOutlined
} from '@ant-design/icons'
import { CharacterCard } from '../../components'
import PageContainer from '../../components/PageContainer'
import StatCard from '../../components/StatCard'

const { TextArea } = Input
const { Option } = Select

const CharacterManagement = () => {
  const [characters, setCharacters] = useState([
    {
      id: 1,
      name: '小助手',
      avatar: '🤖',
      personality: '友善、乐于助人',
      description: '一个贴心的AI助手，随时准备为您提供帮助和支持。',
      tags: ['助手', '友善', '智能'],
      chatCount: 15,
      favorited: true
    },
    {
      id: 2,
      name: '创意伙伴',
      avatar: '🎨',
      personality: '创意、活泼',
      description: '充满创意的伙伴，能够激发您的灵感，一起探索无限可能。',
      tags: ['创意', '灵感', '艺术'],
      chatCount: 8,
      favorited: false
    },
    {
      id: 3,
      name: '智慧导师',
      avatar: '📚',
      personality: '博学、耐心',
      description: '知识渊博的导师，耐心解答您的疑问，引导您学习成长。',
      tags: ['博学', '导师', '教育'],
      chatCount: 23,
      favorited: true
    }
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState(null)
  const [form] = Form.useForm()

  const avatarOptions = ['🤖', '👨', '👩', '🧑', '👦', '👧', '🎨', '📚', '🌟', '💎', '🦄', '🐱']
  const personalityOptions = ['友善', '活泼', '沉稳', '幽默', '严肃', '温柔', '热情', '冷静', '创意', '博学']

  const handleCreate = () => {
    setEditingCharacter(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (character) => {
    setEditingCharacter(character)
    form.setFieldsValue({
      name: character.name,
      avatar: character.avatar,
      personality: character.personality,
      description: character.description,
      tags: character.tags
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个角色吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        setCharacters(characters.filter(char => char.id !== id))
        message.success('角色删除成功')
      }
    })
  }

  const handleToggleFavorite = (id) => {
    setCharacters(characters.map(char => 
      char.id === id ? { ...char, favorited: !char.favorited } : char
    ))
  }

  const handleSubmit = (values) => {
    if (editingCharacter) {
      // 编辑现有角色
      setCharacters(characters.map(char => 
        char.id === editingCharacter.id 
          ? { ...char, ...values }
          : char
      ))
      message.success('角色更新成功')
    } else {
      // 创建新角色
      const newCharacter = {
        id: Date.now(),
        ...values,
        chatCount: 0,
        favorited: false
      }
      setCharacters([...characters, newCharacter])
      message.success('角色创建成功')
    }
    setIsModalVisible(false)
    form.resetFields()
  }

  const totalChats = characters.reduce((sum, char) => sum + char.chatCount, 0)
  const favoriteCount = characters.filter(char => char.favorited).length

  const extraActions = (
    <Button 
      type="primary" 
      icon={<PlusOutlined />}
      onClick={handleCreate}
    >
      创建角色
    </Button>
  )

  return (
    <PageContainer
      title="个人角色管理"
      description="创建和管理您的AI角色"
      extra={extraActions}
    >
      {/* 统计信息 */}
      <div style={{ marginBottom: '2rem' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <StatCard
              title="角色总数"
              value={characters.length}
              suffix="个"
              icon={<UserOutlined />}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard
              title="收藏角色"
              value={favoriteCount}
              suffix="个"
              icon={<HeartOutlined />}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard
              title="总对话数"
              value={totalChats}
              suffix="次"
              icon={<StarOutlined />}
            />
          </Col>
        </Row>
      </div>

      {/* 角色列表 */}
      <Row gutter={[24, 24]}>
        {characters.map((character) => (
          <Col xs={24} sm={12} lg={8} key={character.id}>
            <CharacterCard
              character={character}
              onEdit={() => handleEdit(character)}
              onDelete={() => handleDelete(character.id)}
              onToggleFavorite={() => handleToggleFavorite(character.id)}
            />
          </Col>
        ))}
      </Row>

      {/* 创建/编辑角色弹窗 */}
      <Modal
        title={editingCharacter ? '编辑角色' : '创建新角色'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '1rem' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="角色名称"
                rules={[{ required: true, message: '请输入角色名称' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="avatar"
                label="头像"
                rules={[{ required: true, message: '请选择头像' }]}
              >
                <Select placeholder="选择头像">
                  {avatarOptions.map(avatar => (
                    <Option key={avatar} value={avatar}>
                      <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
                        {avatar}
                      </span>
                      {avatar}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="personality"
            label="性格特点"
            rules={[{ required: true, message: '请输入性格特点' }]}
          >
            <Select
              mode="tags"
              placeholder="选择或输入性格特点"
              style={{ width: '100%' }}
            >
              {personalityOptions.map(personality => (
                <Option key={personality} value={personality}>
                  {personality}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <TextArea
              rows={4}
              placeholder="描述这个角色的特点、背景或能力..."
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="添加标签"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCharacter ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}

export default CharacterManagement