import { create } from 'zustand'

const useChatStore = create((set, get) => ({
  // 聊天状态
  selectedCharacter: null,
  messages: [],
  isTyping: false,
  inputValue: '',

  // 角色列表
  characters: [
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
  ],

  // 聊天历史记录
  chatHistory: {},

  // 选择角色
  selectCharacter: (character) => {
    const { chatHistory } = get()
    const existingMessages = chatHistory[character.id] || []
    
    set({ 
      selectedCharacter: character,
      messages: existingMessages.length > 0 ? existingMessages : [
        {
          id: 1,
          type: 'ai',
          content: `你好！我是${character.name}，${character.description}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    })
  },

  // 发送消息
  sendMessage: (content) => {
    const { selectedCharacter, messages } = get()
    if (!content.trim() || !selectedCharacter) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString()
    }

    const newMessages = [...messages, userMessage]
    
    set({ 
      messages: newMessages,
      inputValue: '',
      isTyping: true
    })

    // 保存到聊天历史
    get().saveChatHistory(selectedCharacter.id, newMessages)

    return userMessage
  },

  // 接收AI回复
  receiveMessage: (content) => {
    const { selectedCharacter, messages } = get()
    if (!selectedCharacter) return

    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content,
      timestamp: new Date().toLocaleTimeString()
    }

    const newMessages = [...messages, aiMessage]
    
    set({ 
      messages: newMessages,
      isTyping: false
    })

    // 保存到聊天历史
    get().saveChatHistory(selectedCharacter.id, newMessages)

    return aiMessage
  },

  // 设置输入值
  setInputValue: (value) => set({ inputValue: value }),

  // 设置打字状态
  setTyping: (typing) => set({ isTyping: typing }),

  // 清空消息
  clearMessages: () => {
    const { selectedCharacter } = get()
    if (!selectedCharacter) return

    const initialMessage = {
      id: 1,
      type: 'ai',
      content: `你好！我是${selectedCharacter.name}，${selectedCharacter.description}`,
      timestamp: new Date().toLocaleTimeString()
    }

    set({ messages: [initialMessage] })
    get().saveChatHistory(selectedCharacter.id, [initialMessage])
  },

  // 保存聊天历史
  saveChatHistory: (characterId, messages) => {
    set((state) => ({
      chatHistory: {
        ...state.chatHistory,
        [characterId]: messages
      }
    }))
  },

  // 获取聊天历史
  getChatHistory: (characterId) => {
    const { chatHistory } = get()
    return chatHistory[characterId] || []
  },

  // 获取在线角色
  getOnlineCharacters: () => {
    const { characters } = get()
    return characters.filter(char => char.online)
  },

  // 获取统计信息
  getStats: () => {
    const { characters, messages, chatHistory } = get()
    const totalMessages = Object.values(chatHistory).reduce(
      (total, msgs) => total + msgs.length, 
      messages.length
    )
    
    return {
      onlineCharacters: characters.filter(char => char.online).length,
      totalMessages,
      activeChats: Object.keys(chatHistory).length
    }
  },

  // 更新角色在线状态
  updateCharacterStatus: (characterId, online) => {
    set((state) => ({
      characters: state.characters.map(char =>
        char.id === characterId ? { ...char, online } : char
      )
    }))
  },

  // 添加角色
  addCharacter: (character) => {
    set((state) => ({
      characters: [...state.characters, { ...character, online: true }]
    }))
  },

  // 删除角色
  removeCharacter: (characterId) => {
    set((state) => {
      const newChatHistory = { ...state.chatHistory }
      delete newChatHistory[characterId]
      
      return {
        characters: state.characters.filter(char => char.id !== characterId),
        chatHistory: newChatHistory,
        selectedCharacter: state.selectedCharacter?.id === characterId ? null : state.selectedCharacter,
        messages: state.selectedCharacter?.id === characterId ? [] : state.messages
      }
    })
  }
}))

export default useChatStore