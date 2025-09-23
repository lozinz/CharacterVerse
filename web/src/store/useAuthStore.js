import { create } from 'zustand'

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    loginType: 'local'
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com', 
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    role: 'user',
    loginType: 'local'
  }
]

// 从localStorage获取存储的认证信息
const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem('auth')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// 保存认证信息到localStorage
const saveAuth = (authData) => {
  try {
    localStorage.setItem('auth', JSON.stringify(authData))
  } catch (error) {
    console.error('Failed to save auth data:', error)
  }
}

// 清除认证信息
const clearAuth = () => {
  try {
    localStorage.removeItem('auth')
  } catch (error) {
    console.error('Failed to clear auth data:', error)
  }
}

// 生成JWT token (模拟)
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7天过期
  }
  return btoa(JSON.stringify(payload))
}

// 验证token是否有效
const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token))
    return payload.exp > Date.now()
  } catch {
    return false
  }
}

// 从token解析用户信息
const parseToken = (token) => {
  try {
    const payload = JSON.parse(atob(token))
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role
    }
  } catch {
    return null
  }
}

export const useAuthStore = create((set, get) => {
  // 初始化时检查存储的认证信息
  const storedAuth = getStoredAuth()
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }

  if (storedAuth && storedAuth.token && isTokenValid(storedAuth.token)) {
    const userInfo = parseToken(storedAuth.token)
    if (userInfo) {
      initialState.user = userInfo
      initialState.token = storedAuth.token
      initialState.isAuthenticated = true
    }
  }

  return {
    ...initialState,

    // 登录
    login: async (username, password, remember = false, loginType = 'local') => {
      set({ loading: true })
      
      try {
        if (loginType === 'github') {
          // 模拟GitHub登录
          const githubUser = {
            id: Date.now(),
            username: 'github_user',
            email: 'github@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=github',
            role: 'user',
            loginType: 'github'
          }
          
          const token = generateToken(githubUser)
          const authData = { token, remember }
          
          set({
            user: githubUser,
            token,
            isAuthenticated: true,
            loading: false
          })
          
          if (remember) {
            saveAuth(authData)
          }
          
          return true
        } else {
          // 本地登录验证
          const user = mockUsers.find(u => 
            (u.username === username || u.email === username) && u.password === password
          )
          
          if (user) {
            const token = generateToken(user)
            const authData = { token, remember }
            
            set({
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                loginType: user.loginType
              },
              token,
              isAuthenticated: true,
              loading: false
            })
            
            if (remember) {
              saveAuth(authData)
            }
            
            return true
          } else {
            set({ loading: false })
            return false
          }
        }
      } catch (error) {
        set({ loading: false })
        console.error('Login error:', error)
        return false
      }
    },

    // 注册
    register: async (username, email, password) => {
      set({ loading: true })
      
      try {
        // 检查用户名和邮箱是否已存在
        const existingUser = mockUsers.find(u => 
          u.username === username || u.email === email
        )
        
        if (existingUser) {
          set({ loading: false })
          return false
        }
        
        // 模拟注册成功，添加到mockUsers
        const newUser = {
          id: Date.now(),
          username,
          email,
          password,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          role: 'user',
          loginType: 'local'
        }
        
        mockUsers.push(newUser)
        
        set({ loading: false })
        return true
      } catch (error) {
        set({ loading: false })
        console.error('Register error:', error)
        return false
      }
    },

    // 登出
    logout: () => {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      })
      clearAuth()
    },

    // 更新用户信息
    updateUser: (userData) => {
      const { user } = get()
      if (user) {
        const updatedUser = { ...user, ...userData }
        set({ user: updatedUser })
        
        // 更新token中的用户信息
        const newToken = generateToken(updatedUser)
        set({ token: newToken })
        
        // 如果之前有保存认证信息，更新它
        const storedAuth = getStoredAuth()
        if (storedAuth) {
          saveAuth({ token: newToken, remember: storedAuth.remember })
        }
      }
    },

    // 检查认证状态
    checkAuth: () => {
      const { token } = get()
      if (token && !isTokenValid(token)) {
        // Token过期，清除认证状态
        get().logout()
        return false
      }
      return !!token
    },

    // 刷新token
    refreshToken: () => {
      const { user } = get()
      if (user) {
        const newToken = generateToken(user)
        set({ token: newToken })
        
        const storedAuth = getStoredAuth()
        if (storedAuth) {
          saveAuth({ token: newToken, remember: storedAuth.remember })
        }
        
        return newToken
      }
      return null
    }
  }
})