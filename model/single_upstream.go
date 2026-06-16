package model

import (
	"errors"
	"os"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"gorm.io/gorm"
)

const (
	singleUpstreamAPIKeyEnv       = "SINGLE_UPSTREAM_API_KEY"
	singleUpstreamAPIKeyLegacyEnv = "CROSS_BORDER_API_KEY"
	singleUpstreamBaseURLEnv      = "SINGLE_UPSTREAM_BASE_URL"
	singleUpstreamChannelNameEnv  = "SINGLE_UPSTREAM_CHANNEL_NAME"
	singleUpstreamGroupEnv        = "SINGLE_UPSTREAM_GROUP"
)

func getSingleUpstreamAPIKeyFromEnv() string {
	key := strings.TrimSpace(os.Getenv(singleUpstreamAPIKeyEnv))
	if key != "" {
		return key
	}
	return strings.TrimSpace(os.Getenv(singleUpstreamAPIKeyLegacyEnv))
}

func getSingleUpstreamEnvOrDefault(envName string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(envName))
	if value == "" {
		return fallback
	}
	return value
}

func singleUpstreamModelsString() string {
	return strings.Join(constant.SingleUpstreamTextModels, ",")
}

func singleUpstreamAnthropicModelsString() string {
	return strings.Join(constant.SingleUpstreamAnthropicModels, ",")
}

func singleUpstreamGeminiModelsString() string {
	return strings.Join(constant.SingleUpstreamGeminiModels, ",")
}

func EnsureSingleUpstreamChannelFromEnv() error {
	key := getSingleUpstreamAPIKeyFromEnv()
	if key == "" {
		return nil
	}

	name := getSingleUpstreamEnvOrDefault(singleUpstreamChannelNameEnv, constant.SingleUpstreamChannelName)
	baseURL := getSingleUpstreamEnvOrDefault(singleUpstreamBaseURLEnv, constant.SingleUpstreamBaseURL)
	group := getSingleUpstreamEnvOrDefault(singleUpstreamGroupEnv, "default")
	if err := ensureSingleUpstreamChannelFromEnv(name, constant.ChannelTypeOpenAI, key, baseURL, group, singleUpstreamModelsString(), 10); err != nil {
		return err
	}
	if err := ensureSingleUpstreamChannelFromEnv(name+" - Anthropic", constant.ChannelTypeAnthropic, key, baseURL, group, singleUpstreamAnthropicModelsString(), 0); err != nil {
		return err
	}
	if err := ensureSingleUpstreamChannelFromEnv(name+" - Gemini", constant.ChannelTypeGemini, key, baseURL, group, singleUpstreamGeminiModelsString(), 0); err != nil {
		return err
	}
	return nil
}

func ensureSingleUpstreamChannelFromEnv(name string, channelType int, key string, baseURL string, group string, models string, priority int64) error {
	var channel Channel
	err := DB.Where("name = ? AND type = ?", name, channelType).First(&channel).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		channel = Channel{
			Type:        channelType,
			Key:         key,
			Status:      common.ChannelStatusEnabled,
			Name:        name,
			CreatedTime: common.GetTimestamp(),
			BaseURL:     &baseURL,
			Models:      models,
			Group:       group,
			Priority:    &priority,
		}
		if err := channel.Insert(); err != nil {
			return err
		}
		common.SysLog("single upstream channel initialized from environment")
		return nil
	}
	if err != nil {
		return err
	}

	channel.Key = key
	channel.Status = common.ChannelStatusEnabled
	channel.BaseURL = &baseURL
	channel.Models = models
	channel.Group = group
	channel.Priority = &priority
	if err := channel.Update(); err != nil {
		return err
	}
	common.SysLog("single upstream channel updated from environment")
	return nil
}
