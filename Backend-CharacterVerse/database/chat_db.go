package database

import (
	"Backend-CharacterVerse/model"
	"errors"
)

func GetRoleByID(roleID uint) (*model.Role, error) {
	var role model.Role
	result := DB.First(&role, roleID)
	if result.Error != nil {
		return nil, errors.New("角色不存在")
	}
	return &role, nil
}

func GetChatHistory(userID, roleID uint, limit int) ([]model.ChatHistory, error) {
	var history []model.ChatHistory
	result := DB.Where("user_id = ? AND role_id = ?", userID, roleID).
		Order("created_at desc").
		Limit(limit).
		Find(&history)

	if result.Error != nil {
		return nil, errors.New("获取历史记录失败")
	}

	// 反转顺序，使最旧的消息在前
	for i, j := 0, len(history)-1; i < j; i, j = i+1, j-1 {
		history[i], history[j] = history[j], history[i]
	}

	return history, nil
}

func SaveChatMessage(userID, roleID uint, userMsg, aiResponse string) error {
	// 保存用户消息
	userHistory := model.ChatHistory{
		UserID:  userID,
		RoleID:  roleID,
		Message: userMsg,
		IsUser:  true,
	}

	// 保存AI回复
	aiHistory := model.ChatHistory{
		UserID:  userID,
		RoleID:  roleID,
		Message: aiResponse,
		IsUser:  false,
	}

	tx := DB.Begin()
	if err := tx.Create(&userHistory).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Create(&aiHistory).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
