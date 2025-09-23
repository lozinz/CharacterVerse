package service

import (
	"Backend-CharacterVerse/database"
	"Backend-CharacterVerse/model"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
)

type ChatMessage struct {
	RoleID  uint   `json:"role_id"`
	Message string `json:"message"`
}

// 七牛云API响应结构
type QiniuResponse struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Index   int `json:"index"`
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
	Usage struct {
		PromptTokens     int `json:"prompt_tokens"`
		CompletionTokens int `json:"completion_tokens"`
		TotalTokens      int `json:"total_tokens"`
	} `json:"usage"`
}

// 七牛云API请求结构
type QiniuRequest struct {
	Stream   bool      `json:"stream"`
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

func HandleChatSession(conn *websocket.Conn, userID uint) {
	for {
		_, msgBytes, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket连接异常关闭: %v", err)
			}
			break
		}

		var chatMsg ChatMessage
		if err := json.Unmarshal(msgBytes, &chatMsg); err != nil {
			sendError(conn, "消息格式错误: "+err.Error())
			continue
		}

		response, err := ProcessMessage(userID, chatMsg.RoleID, chatMsg.Message)
		if err != nil {
			sendError(conn, "处理消息失败: "+err.Error())
			continue
		}

		if err := conn.WriteJSON(response); err != nil {
			log.Printf("发送消息错误: %v", err)
			break
		}
	}
}

func ProcessMessage(userID, roleID uint, message string) (map[string]interface{}, error) {
	role, err := database.GetRoleByID(roleID)
	if err != nil {
		return nil, fmt.Errorf("获取角色信息失败: %w", err)
	}

	history, err := database.GetChatHistory(userID, roleID, 5)
	if err != nil {
		return nil, fmt.Errorf("获取历史消息失败: %w", err)
	}

	messages := buildMessages(role.Description, history, message)

	aiResponse, err := callQiniuLLM(messages)
	if err != nil {
		return nil, fmt.Errorf("调用大模型失败: %w", err)
	}

	if err := database.SaveChatMessage(userID, roleID, message, aiResponse); err != nil {
		log.Printf("保存聊天记录失败: %v", err)
	}

	return map[string]interface{}{
		"role_id": roleID,
		"message": aiResponse,
	}, nil
}

func buildMessages(roleDesc string, history []model.ChatHistory, currentMessage string) []Message {
	messages := []Message{
		{
			Role:    "system",
			Content: "你正在扮演以下角色:\n" + roleDesc + "\n请保持角色设定，用角色的语气和风格回答用户问题。",
		},
	}

	for _, h := range history {
		if h.IsUser {
			messages = append(messages, Message{
				Role:    "user",
				Content: h.Message,
			})
		} else {
			messages = append(messages, Message{
				Role:    "assistant",
				Content: h.Message,
			})
		}
	}

	messages = append(messages, Message{
		Role:    "user",
		Content: currentMessage,
	})

	return messages
}

func callQiniuLLM(messages []Message) (string, error) {
	apiKey := os.Getenv("QINIU_API_KEY")
	if apiKey == "" {
		return "", errors.New("未配置七牛云API密钥")
	}

	// 修改点：使用 DeepSeek 模型
	modelName := "deepseek/deepseek-v3.1-terminus"

	// 如果环境变量指定了模型，则使用环境变量的值
	if envModel := os.Getenv("QINIU_MODEL_NAME"); envModel != "" {
		modelName = envModel
	}

	requestBody := QiniuRequest{
		Stream:   false,
		Model:    modelName, // 使用 DeepSeek 模型
		Messages: messages,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("JSON序列化失败: %w", err)
	}

	req, err := http.NewRequest("POST", "https://openai.qiniu.com/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("创建请求失败: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: 30 * time.Second, // 设置超时时间
	}

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("API请求失败: %w", err)
	}
	defer resp.Body.Close()

	// 读取响应体
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("读取响应体失败: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API返回错误状态码: %d, 响应: %s", resp.StatusCode, string(bodyBytes))
	}

	var apiResponse QiniuResponse
	if err := json.Unmarshal(bodyBytes, &apiResponse); err != nil {
		return "", fmt.Errorf("解析API响应失败: %w", err)
	}

	if len(apiResponse.Choices) == 0 {
		return "", errors.New("API返回空回复")
	}

	return apiResponse.Choices[0].Message.Content, nil
}

func sendError(conn *websocket.Conn, message string) {
	errMsg := map[string]interface{}{
		"error": message,
	}
	if err := conn.WriteJSON(errMsg); err != nil {
		log.Printf("发送错误消息失败: %v", err)
	}
}
