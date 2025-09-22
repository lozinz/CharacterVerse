import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import Sidebar from './components/Sidebar'
import { RouterView } from './router'
import useStore from './store/useStore'
import 'antd/dist/reset.css'
import './styles/variables.css'
import './App.css'

function App() {
  const { theme } = useStore()

  // 设置全局主题属性
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Router>
        <div className={`app ${theme === 'dark' ? 'dark' : ''}`}>
          <Sidebar />
          <main className="main-content">
            <RouterView />
          </main>
        </div>
      </Router>
    </ConfigProvider>
  )
}

export default App