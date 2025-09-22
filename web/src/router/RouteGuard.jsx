import { Navigate, useLocation } from 'react-router-dom'
import useStore from '../store/useStore'

// 路由守卫组件 - 处理需要认证的路由
function RouteGuard({ children, requiresAuth = false }) {
  const { isAuthenticated } = useStore()
  const location = useLocation()

  // 如果路由需要认证但用户未登录，重定向到用户页面
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/user" state={{ from: location }} replace />
  }

  return children
}

export default RouteGuard