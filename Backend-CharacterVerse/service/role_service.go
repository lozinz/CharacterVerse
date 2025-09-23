package service

import (
	"Backend-CharacterVerse/database"
	"Backend-CharacterVerse/model"
	"errors"
)

func AddRole(userID uint, name, description string) (uint, error) {
	// 验证角色名称是否为空
	if name == "" {
		return 0, errors.New("角色名称不能为空")
	}

	// 创建新角色
	newRole := model.Role{
		Name:        name,
		Description: description,
		UserID:      userID,
	}

	// 保存到数据库
	result := database.DB.Create(&newRole)
	if result.Error != nil {
		return 0, result.Error
	}

	return newRole.ID, nil
}
