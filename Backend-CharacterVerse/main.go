package main

import (
	"Backend-CharacterVerse/config"
	"Backend-CharacterVerse/database"
	"Backend-CharacterVerse/middleware"
	"Backend-CharacterVerse/router"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig() // 加载配置
	database.InitDB()   // 初始化数据库连接

	r := gin.Default()
	r.Use(middleware.CorsMiddleware()) // 添加CORS中间件

	router.RouterInit(r) // 初始化路由

	r.Run(":8080")
}
