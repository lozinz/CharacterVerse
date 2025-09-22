import { useEffect } from 'react'
import { Row, Col, Button, Tag, Space } from 'antd'
import { 
  PlusOutlined, 
  MinusOutlined, 
  ReloadOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons'
import { PageContainer, FeatureCard, StatCard, CharacterCard } from '../../components'
import useStore from '../../store/useStore'
import { SearchBar } from './components'
import useHomeStore from './store/useHomeStore'
import { searchService } from './server/homeService'

const Home = () => {
  const { count, increment, decrement, reset, isDark, toggleTheme } = useStore()
  const { 
    searchResults, 
    isSearching, 
    setSearching, 
    setSearchResults, 
    clearSearch 
  } = useHomeStore()

  const features = [
    {
      icon: '👤',
      title: '角色管理',
      description: '创建和自定义您的AI角色，设置独特的性格和特点'
    },
    {
      icon: '💬',
      title: '智能对话',
      description: '与您的AI角色进行自然流畅的对话交流'
    },
    {
      icon: '🎨',
      title: '个性化定制',
      description: '丰富的头像选择和性格设定，打造独一无二的角色'
    }
  ]

  const steps = [
    {
      number: '1',
      title: '创建角色',
      description: '前往"个人角色管理"页面创建您的第一个AI角色'
    },
    {
      number: '2',
      title: '开始聊天',
      description: '在"聊天"页面选择角色并开始有趣的对话'
    },
    {
      number: '3',
      title: '享受体验',
      description: '探索不同角色的独特个性和对话风格'
    }
  ]

  const techStack = [
    'React 18', 'Vite', 'React Router', 'Zustand', 'Ant Design', 'Node.js'
  ]

  // 推荐角色数据
  const recommendedCharacters = [
    {
      id: 1,
      name: '智能助手',
      avatar: '🤖',
      personality: '专业助手',
      description: '专业的AI助手，能够回答各种问题并提供帮助',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: '创意作家',
      avatar: '✍️',
      personality: '创意型',
      description: '富有创造力的写作助手，擅长故事创作和文案撰写',
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      name: '语言导师',
      avatar: '🌎',
      personality: '教育型',
      description: '多语言学习助手，提供语言练习和语法指导',
      createdAt: '2024-01-25'
    },
    {
      id: 4,
      name: '心理咨询师',
      avatar: '💭',
      personality: '关怀型',
      description: '提供情感支持和心理疏导的AI伙伴',
      createdAt: '2024-02-01'
    },
    {
      id: 5,
      name: '技术专家',
      avatar: '💻',
      personality: '技术型',
      description: '编程和技术问题解答专家',
      createdAt: '2024-02-05'
    },
    {
      id: 6,
      name: '娱乐伙伴',
      avatar: '🎮',
      personality: '娱乐型',
      description: '游戏、电影、音乐推荐和讨论伙伴',
      createdAt: '2024-02-10'
    }
  ]

  const counterActions = [
    {
      text: '-',
      icon: <MinusOutlined />,
      onClick: decrement,
      type: 'default'
    },
    {
      text: '+',
      icon: <PlusOutlined />,
      onClick: increment,
      type: 'primary'
    },
    {
      text: '重置',
      icon: <ReloadOutlined />,
      onClick: reset,
      danger: true
    }
  ]

  const themeActions = [
    {
      text: '切换主题',
      icon: isDark ? <SunOutlined /> : <MoonOutlined />,
      onClick: toggleTheme,
      type: 'primary'
    }
  ]

  // 搜索处理函数
  const handleSearch = async (value) => {
    if (!value.trim()) {
      clearSearch()
      return
    }

    setSearching(true)
    try {
      const results = await searchService.search(value)
      setSearchResults(results)
    } catch (error) {
      console.error('搜索失败:', error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  return (
    <>
      {/* 顶部搜索栏 */}

      <PageContainer
        title="CharacterVerse AI"
        description="欢迎来到角色宇宙 - 创建和管理您的AI角色"
        centered={true}
      >
      <SearchBar 
        onSearch={handleSearch}
        loading={isSearching}
        placeholder="输入关键词搜索角色、对话、功能..."
      />

      {/* 推荐角色展示区域 */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px', fontWeight: '600' }}>
          推荐角色
        </h2>
        
        {/* 热门角色 */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px', color: '#1890ff', fontSize: '18px' }}>🔥 热门角色</h3>
          <Row gutter={[16, 16]}>
            {recommendedCharacters.slice(0, 3).map(character => (
              <Col key={character.id} xs={24} sm={12} md={8}>
                <CharacterCard 
                  character={character}
                  showActions={true}
                />
              </Col>
            ))}
          </Row>
        </div>

        {/* 按标签分类推荐 */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px', color: '#52c41a', fontSize: '18px' }}>🏷️ 按标签推荐</h3>
          <Row gutter={[16, 16]}>
            {recommendedCharacters.slice(3).map(character => (
              <Col key={character.id} xs={24} sm={12} md={8}>
                <CharacterCard 
                  character={character}
                  showActions={true}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>

      </PageContainer>
    </>
  )
}

export default Home