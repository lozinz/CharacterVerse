import { lazy } from 'react'

// 懒加载页面组件
const Home = lazy(() => import('../pages/Home'))
const CharacterManagement = lazy(() => import('../pages/CharacterManagement'))
const Chat = lazy(() => import('../pages/Chat'))
const User = lazy(() => import('../pages/User'))
const About = lazy(() => import('../pages/About'))

// 路由配置表
export const routes = [
  {
    path: '/',
    element: Home,
    name: 'home',
    title: '首页',
    icon: '🏠',
    showInNav: true,
    meta: {
      requiresAuth: false,
      description: '应用首页'
    }
  },
  {
    path: '/character',
    element: CharacterManagement,
    name: 'character',
    title: '个人角色管理',
    icon: '👤',
    showInNav: true,
    meta: {
      requiresAuth: false,
      description: '管理个人角色'
    }
  },
  {
    path: '/chat',
    element: Chat,
    name: 'chat',
    title: '聊天',
    icon: '💬',
    showInNav: true,
    meta: {
      requiresAuth: false,
      description: '角色聊天'
    }
  },
  {
    path: '/user',
    element: User,
    name: 'user',
    title: '用户中心',
    icon: '👤',
    showInNav: false,
    meta: {
      requiresAuth: false,
      description: '用户登录和管理'
    }
  },
  {
    path: '/about',
    element: About,
    name: 'about',
    title: '关于',
    icon: 'ℹ️',
    showInNav: true,
    meta: {
      requiresAuth: false,
      description: '关于项目信息'
    }
  }
]

// 获取导航路由
export const getNavRoutes = () => {
  return routes.filter(route => route.showInNav)
}

// 根据路径获取路由
export const getRouteByPath = (path) => {
  return routes.find(route => route.path === path)
}

// 根据名称获取路由
export const getRouteByName = (name) => {
  return routes.find(route => route.name === name)
}