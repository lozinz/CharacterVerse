package model

import "gorm.io/gorm"

type ChatHistory struct {
	gorm.Model
	UserID  uint   `gorm:"index" json:"user_id"`
	RoleID  uint   `gorm:"index" json:"role_id"`
	Message string `gorm:"type:text;charset=utf8mb4" json:"message"` // 添加字符集配置
	IsUser  bool   `json:"is_user"`
}
