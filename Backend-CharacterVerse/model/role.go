package model

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name        string `gorm:"size:100;not null" json:"name"`         // 角色名称
	Description string `gorm:"type:text;not null" json:"description"` // 角色描述
	UserID      uint   `gorm:"not null" json:"user_id"`               // 关联的用户ID
}
