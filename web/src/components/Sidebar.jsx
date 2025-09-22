import { Link, useLocation } from 'react-router-dom'
import { Switch, Avatar, Button, Divider, Space } from 'antd'
import { 
  HomeOutlined, 
  UserOutlined, 
  MessageOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  LoginOutlined
} from '@ant-design/icons'
import { getNavRoutes } from '../router'
import useStore from '../store/useStore'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()
  const { isDark, toggleTheme, user, logout } = useStore()
  const navRoutes = getNavRoutes()

  // 图标映射
  const iconMap = {
    '🏠': <HomeOutlined />,
    '👤': <UserOutlined />,
    '💬': <MessageOutlined />
  }

  return (
    <div className={`sidebar ${isDark ? 'dark' : ''}`}>
      {/* 应用标题 */}
      <div className="sidebar-header">
        <div className="app-logo">
          <span className="logo-icon">🤖</span>
          <h2 className="app-title">CharacterVerse</h2>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navRoutes.map(route => (
            <li key={route.path} className="nav-item">
              <Link
                to={route.path}
                className={`nav-link ${location.pathname === route.path ? 'active' : ''}`}
                title={route.meta?.description}
              >
                <span className="nav-icon">
                  {iconMap[route.icon] || route.icon}
                </span>
                <span className="nav-text">{route.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 用户信息 */}
      <div className="sidebar-footer">
        {user ? (
          <div className="user-section">
            <div className="user-info">
              <Avatar 
                size={40} 
                icon={<UserOutlined />}
                style={{ 
                  backgroundColor: isDark ? 'var(--primary-color)' : 'var(--success-color)',
                  marginBottom: 'var(--spacing-sm)'
                }}
              />
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />}
              onClick={logout}
              size="small"
              block
            >
              退出登录
            </Button>
          </div>
        ) : (
          <div className="login-prompt">
            <Avatar 
              size={40} 
              icon={<UserOutlined />}
              style={{ 
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-sm)'
              }}
            />
            <p>未登录</p>
            <Link to="/user">
              <Button 
                type="primary" 
                icon={<LoginOutlined />}
                size="small"
                block
              >
                去登录
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar