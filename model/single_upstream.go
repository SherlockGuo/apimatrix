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

func EnsureSingleUpstreamChannelFromEnv() error {
	key := getSingleUpstreamAPIKeyFromEnv()
	if key == "" {
		return nil
	}

	name := getSingleUpstreamEnvOrDefault(singleUpstreamChannelNameEnv, constant.SingleUpstreamChannelName)
	baseURL := getSingleUpstreamEnvOrDefault(singleUpstreamBaseURLEnv, constant.SingleUpstreamBaseURL)
	group := getSingleUpstreamEnvOrDefault(singleUpstreamGroupEnv, "default")
	models := singleUpstreamModelsString()

	var channel Channel
	err := DB.Where("name = ? AND type = ?", name, constant.ChannelTypeOpenAI).First(&channel).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		channel = Channel{
			Type:        constant.ChannelTypeOpenAI,
			Key:         key,
			Status:      common.ChannelStatusEnabled,
			Name:        name,
			CreatedTime: common.GetTimestamp(),
			BaseURL:     &baseURL,
			Models:      models,
			Group:       group,
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
	if err := channel.Update(); err != nil {
		return err
	}
	common.SysLog("single upstream channel updated from environment")
	return nil
}
