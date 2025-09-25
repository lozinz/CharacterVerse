package service

import (
	"Backend-CharacterVerse/database"
	"Backend-CharacterVerse/model"
	"errors"
)

func AddRole(userID uint, name, description, gender string, age int, voiceType string) (uint, error) {
	// 验证角色名称是否为空
	if name == "" {
		return 0, errors.New("角色名称不能为空")
	}

	// 验证性别是否有效
	validGenders := []string{"男", "女", "其他", "未知"}
	genderValid := false
	for _, g := range validGenders {
		if gender == g {
			genderValid = true
			break
		}
	}
	if !genderValid {
		return 0, errors.New("无效的性别参数")
	}

	// 验证年龄是否在合理范围
	if age < 0 || age > 120 {
		return 0, errors.New("年龄必须在0-120之间")
	}

	// 验证声音类型是否有效
	if _, valid := model.GetVoiceInfo(voiceType); !valid {
		return 0, errors.New("无效的声音类型")
	}

	// 创建新角色
	newRole := model.Role{
		Name:        name,
		Description: description,
		UserID:      userID,
		Gender:      gender,
		Age:         age,
		VoiceType:   voiceType,
	}

	// 保存到数据库
	result := database.DB.Create(&newRole)
	if result.Error != nil {
		return 0, result.Error
	}

	return newRole.ID, nil
}
