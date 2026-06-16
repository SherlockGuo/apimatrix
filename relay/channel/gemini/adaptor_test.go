package gemini

import (
	"net/http"
	"net/http/httptest"
	"testing"

	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestGetRequestURLUsesGeminiCompatibilityPath(t *testing.T) {
	adaptor := Adaptor{}
	url, err := adaptor.GetRequestURL(&relaycommon.RelayInfo{
		ChannelMeta: &relaycommon.ChannelMeta{
			ChannelBaseUrl: "http://upstream.example",
		},
		RequestURLPath: "/gemini/v1/models/gemini-3.1-pro-preview:generateContent",
	})

	require.NoError(t, err)
	require.Equal(t, "http://upstream.example/gemini/v1/models/gemini-3.1-pro-preview:generateContent", url)
}

func TestSetupRequestHeaderUsesBearerForGeminiCompatibilityPath(t *testing.T) {
	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(httptest.NewRecorder())
	c.Request = httptest.NewRequest(http.MethodPost, "/gemini/v1/models/gemini-3.1-pro-preview:generateContent", nil)
	header := http.Header{}
	adaptor := Adaptor{}

	err := adaptor.SetupRequestHeader(c, &header, &relaycommon.RelayInfo{
		ChannelMeta: &relaycommon.ChannelMeta{
			ApiKey: "provider-key",
		},
		RequestURLPath: "/gemini/v1/models/gemini-3.1-pro-preview:generateContent",
	})

	require.NoError(t, err)
	require.Equal(t, "Bearer provider-key", header.Get("Authorization"))
	require.Empty(t, header.Get("x-goog-api-key"))
}
