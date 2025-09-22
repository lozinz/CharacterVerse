import { Avatar, Typography } from 'antd'
import { UserOutlined, RobotOutlined } from '@ant-design/icons'

const { Text } = Typography

const MessageItem = ({ message, character }) => {
  const isUser = message.type === 'user'
  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '1rem'
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}
      >
        <Avatar 
          size={32}
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          style={{ 
            backgroundColor: isUser ? '#1890ff' : '#52c41a',
            fontSize: '0.875rem'
          }}
        >
          {!isUser && character ? character.avatar : null}
        </Avatar>
        <div>
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              backgroundColor: isUser ? '#1890ff' : 'white',
              color: isUser ? 'white' : 'black',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              wordBreak: 'break-word'
            }}
          >
            {message.content}
          </div>
          <Text 
            type="secondary" 
            style={{ 
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              display: 'block',
              textAlign: isUser ? 'right' : 'left'
            }}
          >
            {message.timestamp}
          </Text>
        </div>
      </div>
    </div>
  )
}

export default MessageItem