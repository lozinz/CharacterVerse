import { Card } from 'antd'
import './FeatureCard.css'

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  hoverable = true,
  className = '',
  onClick,
  ...props 
}) => {
  return (
    <Card
      hoverable={hoverable}
      className={`feature-card ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="feature-card-content">
        <div className="feature-icon">
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
      </div>
    </Card>
  )
}

export default FeatureCard