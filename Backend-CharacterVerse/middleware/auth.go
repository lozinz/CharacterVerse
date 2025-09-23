package middleware

import (
	"Backend-CharacterVerse/utils"
	"Backend-CharacterVerse/utils/response"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 特殊处理 WebSocket 连接
		if isWebSocketUpgrade(c.Request) {
			handleWebSocketAuth(c)
			return
		}

		// 普通 HTTP 请求处理
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, response.Unauthorized("未提供认证令牌"))
			c.Abort()
			return
		}

		// 去除Bearer前缀
		if strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = strings.TrimPrefix(tokenString, "Bearer ")
		} else {
			fmt.Println("Warning: Token without Bearer prefix")
		}

		processToken(c, tokenString)
	}
}

// 判断是否为 WebSocket 升级请求
func isWebSocketUpgrade(r *http.Request) bool {
	return strings.ToLower(r.Header.Get("Connection")) == "upgrade" &&
		strings.ToLower(r.Header.Get("Upgrade")) == "websocket"
}

// 处理 WebSocket 认证
func handleWebSocketAuth(c *gin.Context) {
	// 从查询参数获取 token
	tokenString := c.Query("token")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, response.Unauthorized("WebSocket连接未提供认证令牌"))
		c.Abort()
		return
	}

	processToken(c, tokenString)
}

// 处理令牌验证的公共逻辑
func processToken(c *gin.Context, tokenString string) {
	token, err := utils.ParseToken(tokenString)
	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, response.Unauthorized("无效的认证令牌"))
		c.Abort()
		return
	}

	// 将用户ID存入上下文
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if userID, exists := claims["user_id"]; exists {
			if id, ok := userID.(float64); ok {
				c.Set("userID", uint(id))
				c.Next()
				return
			}
		}
	}

	c.JSON(http.StatusUnauthorized, response.Unauthorized("令牌缺少用户ID声明"))
	c.Abort()
}
