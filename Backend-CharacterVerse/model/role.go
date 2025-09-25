package model

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name        string `gorm:"size:100;not null" json:"name"`               // 角色名称
	Description string `gorm:"type:text;not null" json:"description"`       // 角色描述
	UserID      uint   `gorm:"not null" json:"user_id"`                     // 关联的用户ID
	Gender      string `gorm:"size:10;not null;default:'未知'" json:"gender"` // 性别
	Age         int    `gorm:"not null;default:0" json:"age"`               // 年龄
	VoiceType   string `gorm:"size:50;not null" json:"voice_type"`          // 声音类型标识
}
