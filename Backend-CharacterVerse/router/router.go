package router

import (
	"Backend-CharacterVerse/api"
	"Backend-CharacterVerse/middleware"

	"github.com/gin-gonic/gin"
)

func RouterInit(r *gin.Engine) {
	// 公共路由
	public := r.Group("/api")
	{
		public.POST("/user/register", api.Register)
		public.POST("/user/login", api.Login)
	}

	// 需要认证的路由
	auth := r.Group("/api")
	auth.Use(middleware.JWTAuth())
	{
		// 后续添加需要认证的接口
	}
}
