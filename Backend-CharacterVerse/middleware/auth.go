package middleware

import (
	"Backend-CharacterVerse/utils"
	"Backend-CharacterVerse/utils/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, response.Unauthorized("未提供认证令牌"))
			c.Abort()
			return
		}

		token, err := utils.ParseToken(tokenString)
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, response.Unauthorized("无效的认证令牌"))
			c.Abort()
			return
		}

		// 将用户ID存入上下文
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			userID := uint(claims["user_id"].(float64))
			c.Set("userID", userID)
		}

		c.Next()
	}
}
