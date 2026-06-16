package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	relayconstant "github.com/QuantumNous/new-api/relay/constant"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestExtractModelNameFromGeminiPathSupportsTargetPrefix(t *testing.T) {
	require.Equal(t, "gemini-3.1-pro-preview", extractModelNameFromGeminiPath("/gemini/v1/models/gemini-3.1-pro-preview:generateContent"))
	require.Equal(t, "gemini-3-pro-preview", extractModelNameFromGeminiPath("/v1beta/models/gemini-3-pro-preview:streamGenerateContent"))
}

func TestGetModelRequestSetsGeminiPreferredChannelType(t *testing.T) {
	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	c.Request = httptest.NewRequest(http.MethodPost, "/gemini/v1/models/gemini-3.1-pro-preview:generateContent", nil)

	modelRequest, shouldSelectChannel, err := getModelRequest(c)
	require.NoError(t, err)
	require.True(t, shouldSelectChannel)
	require.Equal(t, "gemini-3.1-pro-preview", modelRequest.Model)
	require.Equal(t, constant.ChannelTypeGemini, common.GetContextKeyInt(c, constant.ContextKeyPreferredChannelType))
	require.Equal(t, relayconstant.RelayModeGemini, c.GetInt("relay_mode"))
}

func TestGetModelRequestSetsGeminiPreferredChannelTypeForNativePath(t *testing.T) {
	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	c.Request = httptest.NewRequest(http.MethodPost, "/v1beta/models/gemini-3-pro-preview:generateContent", nil)

	modelRequest, shouldSelectChannel, err := getModelRequest(c)
	require.NoError(t, err)
	require.True(t, shouldSelectChannel)
	require.Equal(t, "gemini-3-pro-preview", modelRequest.Model)
	require.Equal(t, constant.ChannelTypeGemini, common.GetContextKeyInt(c, constant.ContextKeyPreferredChannelType))
	require.Equal(t, relayconstant.RelayModeGemini, c.GetInt("relay_mode"))
}

func TestGetModelRequestSetsAnthropicPreferredChannelType(t *testing.T) {
	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	c.Request = httptest.NewRequest(
		http.MethodPost,
		"/anthropic/messages",
		strings.NewReader(`{"model":"claude-opus-4-6","messages":[{"role":"user","content":"hi"}],"max_tokens":32}`),
	)
	c.Request.Header.Set("Content-Type", "application/json")

	modelRequest, shouldSelectChannel, err := getModelRequest(c)
	require.NoError(t, err)
	require.True(t, shouldSelectChannel)
	require.Equal(t, "claude-opus-4-6", modelRequest.Model)
	require.Equal(t, constant.ChannelTypeAnthropic, common.GetContextKeyInt(c, constant.ContextKeyPreferredChannelType))
}

func TestGetModelRequestSetsAnthropicPreferredChannelTypeForNativePath(t *testing.T) {
	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	c.Request = httptest.NewRequest(
		http.MethodPost,
		"/v1/messages",
		strings.NewReader(`{"model":"claude-sonnet-4-6","messages":[{"role":"user","content":"hi"}],"max_tokens":32}`),
	)
	c.Request.Header.Set("Content-Type", "application/json")

	modelRequest, shouldSelectChannel, err := getModelRequest(c)
	require.NoError(t, err)
	require.True(t, shouldSelectChannel)
	require.Equal(t, "claude-sonnet-4-6", modelRequest.Model)
	require.Equal(t, constant.ChannelTypeAnthropic, common.GetContextKeyInt(c, constant.ContextKeyPreferredChannelType))
}

func TestGetModelRequestSetsNewAPIPreferredChannelType(t *testing.T) {
	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	c.Request = httptest.NewRequest(
		http.MethodPost,
		"/newapi/v1/chat/completions",
		strings.NewReader(`{"model":"gpt-5.4","messages":[{"role":"user","content":"hi"}]}`),
	)
	c.Request.Header.Set("Content-Type", "application/json")

	modelRequest, shouldSelectChannel, err := getModelRequest(c)
	require.NoError(t, err)
	require.True(t, shouldSelectChannel)
	require.Equal(t, "gpt-5.4", modelRequest.Model)
	require.Equal(t, constant.ChannelTypeOpenAI, common.GetContextKeyInt(c, constant.ContextKeyPreferredChannelType))
}
