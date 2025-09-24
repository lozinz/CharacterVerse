package service

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

// ASR请求结构体
type ASRRequest struct {
	AudioURL string `json:"audio_url" binding:"required"`
	Format   string `json:"format,omitempty"` // 音频格式
}

// 七牛云ASR请求结构体
type QiniuASRRequest struct {
	Model string `json:"model"`
	Audio struct {
		Format string `json:"format"`
		URL    string `json:"url"`
	} `json:"audio"`
}

// 七牛云ASR响应结构体
type QiniuASRResponse struct {
	Reqid     string `json:"reqid"`
	Operation string `json:"operation"`
	Data      struct {
		AudioInfo struct {
			Duration int `json:"duration"`
		} `json:"audio_info"`
		Result struct {
			Additions struct {
				Duration string `json:"duration"`
			} `json:"additions"`
			Text string `json:"text"`
		} `json:"result"`
	} `json:"data"`
}

// RecognizeSpeech 调用七牛云ASR服务识别语音
func RecognizeSpeech(audioURL string, format string) (string, error) {
	apiKey := os.Getenv("QINIU_API_KEY")
	if apiKey == "" {
		return "", errors.New("未配置七牛云API密钥")
	}

	// 验证音频URL
	if audioURL == "" {
		return "", errors.New("音频URL不能为空")
	}

	// 设置默认音频格式
	if format == "" {
		format = "mp3" // 默认格式
	}

	// 构造请求体
	asrReq := QiniuASRRequest{
		Model: "asr",
		Audio: struct {
			Format string `json:"format"`
			URL    string `json:"url"`
		}{
			Format: format,
			URL:    audioURL,
		},
	}

	jsonData, err := json.Marshal(asrReq)
	if err != nil {
		return "", fmt.Errorf("JSON序列化失败: %w", err)
	}

	// 创建HTTP请求
	req, err := http.NewRequest(
		"POST",
		"https://openai.qiniu.com/v1/voice/asr",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		return "", fmt.Errorf("创建请求失败: %w", err)
	}

	// 设置请求头
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{
		Timeout: 60 * time.Second,
	}

	// 发送请求
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("API请求失败: %w", err)
	}
	defer resp.Body.Close()

	// 检查响应状态
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("ASR API返回错误状态码: %d, 响应: %s", resp.StatusCode, string(bodyBytes))
	}

	// 解析响应
	var apiResponse QiniuASRResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return "", fmt.Errorf("解析API响应失败: %w", err)
	}

	// 提取识别文本
	if apiResponse.Data.Result.Text != "" {
		return apiResponse.Data.Result.Text, nil
	}

	return "", errors.New("未识别到有效文本")
}

// ASRHandler 处理ASR请求的API端点
func ASRHandler(c *gin.Context) {
	// 解析请求参数
	var request ASRRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	// 识别语音
	text, err := RecognizeSpeech(request.AudioURL, request.Format)
	if err != nil {
		log.Printf("语音识别失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "语音识别失败: " + err.Error()})
		return
	}

	// 返回识别结果
	c.JSON(http.StatusOK, gin.H{
		"recognized_text": text,
	})
}
