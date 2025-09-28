package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex;size:50" json:"username"`
	Password string `gorm:"size:100" json:"-"`
}
