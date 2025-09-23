package api

import (
	"Backend-CharacterVerse/service"
	"Backend-CharacterVerse/utils/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AddRoleRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
}

func AddRole(c *gin.Context) {
	// 从JWT中获取用户ID
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, response.Unauthorized("用户未认证"))
		return
	}

	// 解析请求参数
	var req AddRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest("参数错误"))
		return
	}

	// 添加角色
	roleID, err := service.AddRole(userID.(uint), req.Name, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.InternalError(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.Success(gin.H{"role_id": roleID}))
}
