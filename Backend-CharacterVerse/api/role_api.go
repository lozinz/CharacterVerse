package api

import (
	"Backend-CharacterVerse/service"
	"Backend-CharacterVerse/utils/response"

	"github.com/gin-gonic/gin"
)

type AddRoleRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
	Gender      string `json:"gender" binding:"required"`
	Age         int    `json:"age" binding:"required"`
	VoiceType   string `json:"voice_type" binding:"required"`
}

func AddRole(c *gin.Context) {
	// 从JWT中获取用户ID
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(response.Unauthorized("用户未认证").Code, response.Unauthorized("用户未认证"))
		return
	}

	// 解析请求参数
	var req AddRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		resp := response.BadRequest("参数错误: " + err.Error())
		c.JSON(resp.Code, resp)
		return
	}

	// 添加角色
	roleID, err := service.AddRole(
		userID.(uint),
		req.Name,
		req.Description,
		req.Gender,
		req.Age,
		req.VoiceType,
	)
	if err != nil {
		resp := response.InternalError(err.Error())
		c.JSON(resp.Code, resp)
		return
	}

	resp := response.Success(gin.H{"role_id": roleID})
	c.JSON(resp.Code, resp)
}
