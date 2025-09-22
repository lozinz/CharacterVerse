import { create } from 'zustand'

const useCharacterStore = create((set, get) => ({
  // 角色列表
  characters: [
    {
      id: 1,
      name: '小助手',
      avatar: '🤖',
      personality: '友善、乐于助人',
      description: '一个贴心的AI助手，随时准备为您提供帮助和支持。',
      tags: ['助手', '友善', '智能'],
      chatCount: 15,
      favorited: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 2,
      name: '创意伙伴',
      avatar: '🎨',
      personality: '创意、活泼',
      description: '充满创意的伙伴，能够激发您的灵感，一起探索无限可能。',
      tags: ['创意', '灵感', '艺术'],
      chatCount: 8,
      favorited: false,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-22')
    },
    {
      id: 3,
      name: '智慧导师',
      avatar: '📚',
      personality: '博学、耐心',
      description: '知识渊博的导师，耐心解答您的疑问，引导您学习成长。',
      tags: ['博学', '导师', '教育'],
      chatCount: 23,
      favorited: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25')
    }
  ],

  // UI状态
  isModalVisible: false,
  editingCharacter: null,
  loading: false,
  searchKeyword: '',

  // 获取角色列表
  getCharacters: () => get().characters,

  // 获取收藏角色
  getFavoriteCharacters: () => get().characters.filter(char => char.favorited),

  // 获取角色统计
  getStats: () => {
    const characters = get().characters
    return {
      total: characters.length,
      favorited: characters.filter(char => char.favorited).length,
      totalChats: characters.reduce((sum, char) => sum + char.chatCount, 0)
    }
  },

  // 添加角色
  addCharacter: (characterData) => set((state) => {
    const newCharacter = {
      id: Date.now(),
      ...characterData,
      chatCount: 0,
      favorited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return {
      characters: [...state.characters, newCharacter]
    }
  }),

  // 更新角色
  updateCharacter: (id, updates) => set((state) => ({
    characters: state.characters.map(char => 
      char.id === id 
        ? { ...char, ...updates, updatedAt: new Date() }
        : char
    )
  })),

  // 删除角色
  deleteCharacter: (id) => set((state) => ({
    characters: state.characters.filter(char => char.id !== id)
  })),

  // 切换收藏状态
  toggleFavorite: (id) => set((state) => ({
    characters: state.characters.map(char => 
      char.id === id 
        ? { ...char, favorited: !char.favorited, updatedAt: new Date() }
        : char
    )
  })),

  // 增加聊天次数
  incrementChatCount: (id) => set((state) => ({
    characters: state.characters.map(char => 
      char.id === id 
        ? { ...char, chatCount: char.chatCount + 1, updatedAt: new Date() }
        : char
    )
  })),

  // Modal 控制
  showModal: (character = null) => set({ 
    isModalVisible: true, 
    editingCharacter: character 
  }),

  hideModal: () => set({ 
    isModalVisible: false, 
    editingCharacter: null 
  }),

  // 设置加载状态
  setLoading: (loading) => set({ loading }),

  // 搜索功能
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  // 根据关键词过滤角色
  getFilteredCharacters: () => {
    const { characters, searchKeyword } = get()
    if (!searchKeyword.trim()) return characters
    
    return characters.filter(char => 
      char.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      char.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      char.personality.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      char.tags.some(tag => tag.toLowerCase().includes(searchKeyword.toLowerCase()))
    )
  }
}))

export default useCharacterStore