package openai

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/dto"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestOpenaiHandlerRedactsOpenRouterEnterpriseFailureData(t *testing.T) {
	gin.SetMode(gin.TestMode)

	var logBuffer bytes.Buffer
	common.LogWriterMu.Lock()
	oldWriter := gin.DefaultErrorWriter
	gin.DefaultErrorWriter = &logBuffer
	common.LogWriterMu.Unlock()
	t.Cleanup(func() {
		common.LogWriterMu.Lock()
		gin.DefaultErrorWriter = oldWriter
		common.LogWriterMu.Unlock()
	})

	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	c.Request = httptest.NewRequest(http.MethodPost, "/v1/chat/completions", nil)

	enabled := true
	info := &relaycommon.RelayInfo{
		ChannelMeta: &relaycommon.ChannelMeta{
			ChannelType: constant.ChannelTypeOpenRouter,
			ChannelOtherSettings: dto.ChannelOtherSettings{
				OpenRouterEnterprise: &enabled,
			},
		},
	}

	payload := `{"success":false,"data":{"choices":[{"message":{"content":"secret response text"}}]}}`
	resp := &http.Response{
		Body: io.NopCloser(bytes.NewReader([]byte(payload))),
	}

	usage, apiErr := OpenaiHandler(c, info, resp)
	require.Nil(t, usage)
	require.NotNil(t, apiErr)
	require.Contains(t, logBuffer.String(), "openrouter enterprise response success=false")
	require.Contains(t, logBuffer.String(), "response body omitted for privacy")
	require.NotContains(t, logBuffer.String(), "secret response text")
}

func TestOpenaiHandlerNormalizesInputOutputTokenUsage(t *testing.T) {
	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	c.Request = httptest.NewRequest(http.MethodPost, "/v1/chat/completions", nil)

	info := &relaycommon.RelayInfo{
		OriginModelName: "gpt-5.4",
		ChannelMeta: &relaycommon.ChannelMeta{
			UpstreamModelName: "gpt-5.4",
		},
	}

	payload := `{"id":"chatcmpl_123","object":"chat.completion","created":1710000000,"model":"gpt-5.4","choices":[],"usage":{"input_tokens":100,"output_tokens":20,"total_tokens":120}}`
	resp := &http.Response{
		Body: io.NopCloser(bytes.NewReader([]byte(payload))),
	}

	usage, apiErr := OpenaiHandler(c, info, resp)
	require.Nil(t, apiErr)
	require.NotNil(t, usage)
	require.Equal(t, 100, usage.PromptTokens)
	require.Equal(t, 20, usage.CompletionTokens)
	require.Equal(t, 120, usage.TotalTokens)
}
