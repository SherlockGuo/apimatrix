package model

import (
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/stretchr/testify/require"
)

func TestEnsureSingleUpstreamChannelFromEnvCreatesProtocolChannels(t *testing.T) {
	truncateTables(t)
	t.Setenv("SINGLE_UPSTREAM_API_KEY", "provider-key")

	require.NoError(t, EnsureSingleUpstreamChannelFromEnv())

	var channels []Channel
	require.NoError(t, DB.Order("type ASC").Find(&channels).Error)
	require.Len(t, channels, 3)

	byType := map[int]Channel{}
	for _, channel := range channels {
		byType[channel.Type] = channel
	}

	openAI := byType[constant.ChannelTypeOpenAI]
	require.Equal(t, constant.SingleUpstreamChannelName, openAI.Name)
	require.Equal(t, stringsJoin(constant.SingleUpstreamTextModels), openAI.Models)
	require.Equal(t, int64(10), openAI.GetPriority())

	anthropic := byType[constant.ChannelTypeAnthropic]
	require.Equal(t, constant.SingleUpstreamAnthropicChannelName, anthropic.Name)
	require.Equal(t, stringsJoin(constant.SingleUpstreamAnthropicModels), anthropic.Models)
	require.Equal(t, int64(0), anthropic.GetPriority())

	gemini := byType[constant.ChannelTypeGemini]
	require.Equal(t, constant.SingleUpstreamGeminiChannelName, gemini.Name)
	require.Equal(t, stringsJoin(constant.SingleUpstreamGeminiModels), gemini.Models)
	require.Equal(t, int64(0), gemini.GetPriority())
}

func TestGetChannelByTypePrefersRequestedProtocol(t *testing.T) {
	truncateTables(t)
	modelName := "gemini-3.1-pro-preview"
	openAIPriority := int64(10)
	geminiPriority := int64(0)

	openAI := Channel{
		Type:        constant.ChannelTypeOpenAI,
		Key:         "key",
		Status:      common.ChannelStatusEnabled,
		Name:        "openai",
		CreatedTime: common.GetTimestamp(),
		Models:      modelName,
		Group:       "default",
		Priority:    &openAIPriority,
	}
	require.NoError(t, openAI.Insert())

	gemini := Channel{
		Type:        constant.ChannelTypeGemini,
		Key:         "key",
		Status:      common.ChannelStatusEnabled,
		Name:        "gemini",
		CreatedTime: common.GetTimestamp(),
		Models:      modelName,
		Group:       "default",
		Priority:    &geminiPriority,
	}
	require.NoError(t, gemini.Insert())

	selected, err := GetChannel("default", modelName, 0)
	require.NoError(t, err)
	require.Equal(t, constant.ChannelTypeOpenAI, selected.Type)

	selected, err = GetChannelByType("default", modelName, constant.ChannelTypeGemini, 0)
	require.NoError(t, err)
	require.Equal(t, constant.ChannelTypeGemini, selected.Type)
}

func stringsJoin(items []string) string {
	result := ""
	for i, item := range items {
		if i > 0 {
			result += ","
		}
		result += item
	}
	return result
}
