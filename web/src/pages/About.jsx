import useStore from '../store/useStore'
import './Pages.css'

function About() {
  const { theme, user, isAuthenticated } = useStore()

  return (
    <div className="page">
      <h1>关于我们</h1>
      <p>这是一个使用现代React技术栈构建的项目。</p>
      
      <div className="tech-stack">
        <h2>技术栈</h2>
        <ul>
          <li>⚛️ React 18.3.1</li>
          <li>⚡ Vite 5.4.20</li>
          <li>🚦 React Router DOM</li>
          <li>🐻 Zustand (状态管理)</li>
          <li>🎨 CSS3</li>
        </ul>
      </div>

      <div className="status-info">
        <h2>当前状态</h2>
        <p>主题: <span className="highlight">{theme}</span></p>
        <p>用户状态: <span className="highlight">
          {isAuthenticated ? `已登录 (${user?.name})` : '未登录'}
        </span></p>
      </div>
    </div>
  )
}

export default About