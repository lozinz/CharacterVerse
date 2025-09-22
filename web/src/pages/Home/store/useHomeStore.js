import { create } from 'zustand'

const useHomeStore = create((set, get) => ({
  // 搜索相关状态
  searchResults: [],
  isSearching: false,
  searchKeyword: '',

  // 统计数据
  stats: {
    totalCharacters: 3,
    totalChats: 0,
    totalFeatures: 6
  },

  // 搜索功能
  setSearching: (loading) => set({ isSearching: loading }),
  
  setSearchResults: (results) => set({ searchResults: results }),
  
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  // 清空搜索
  clearSearch: () => set({ 
    searchResults: [], 
    searchKeyword: '',
    isSearching: false 
  }),

  // 更新统计数据
  updateStats: (newStats) => set((state) => ({
    stats: { ...state.stats, ...newStats }
  })),

  // 增加聊天次数
  incrementChatCount: () => set((state) => ({
    stats: { 
      ...state.stats, 
      totalChats: state.stats.totalChats + 1 
    }
  }))
}))

export default useHomeStore