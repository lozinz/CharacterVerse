import { useState } from 'react'
import useStore from '../store/useStore'
import './Pages.css'

function User() {
  const { user, isAuthenticated, setUser, logout } = useStore()
  const [name, setName] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (name.trim()) {
      setUser({ name: name.trim(), id: Date.now() })
      setName('')
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="page">
      <h1>用户中心</h1>
      
      {!isAuthenticated ? (
        <div className="login-section">
          <h2>登录</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="请输入用户名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
            <button type="submit" className="login-btn">登录</button>
          </form>
        </div>
      ) : (
        <div className="user-info">
          <h2>欢迎回来！</h2>
          <div className="user-card">
            <p><strong>用户名:</strong> {user.name}</p>
            <p><strong>用户ID:</strong> {user.id}</p>
            <p><strong>登录状态:</strong> 已登录</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            退出登录
          </button>
        </div>
      )}
    </div>
  )
}

export default User