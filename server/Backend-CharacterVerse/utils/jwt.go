package utils

import (
	"Backend-CharacterVerse/config"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func GenerateToken(userID uint) (string, error) {
	cfg := config.LoadConfig()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	return token.SignedString([]byte(cfg.JWTSecret))
}

func ParseToken(tokenString string) (*jwt.Token, error) {
	cfg := config.LoadConfig()
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(cfg.JWTSecret), nil
	})
}
