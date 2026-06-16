package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func performTextOnlyRequest(path string) *httptest.ResponseRecorder {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(TextOnlyRelay())
	router.Any("/*path", func(c *gin.Context) {
		c.Status(http.StatusNoContent)
	})

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, path, nil)
	router.ServeHTTP(recorder, request)
	return recorder
}

func TestTextOnlyRelayBlocksMediaRoutes(t *testing.T) {
	mediaPaths := []string{
		"/v1/images/generations",
		"/v1/edits",
		"/v1/audio/speech",
		"/v1/audio/transcriptions",
		"/v1/realtime",
		"/mj/submit/imagine",
		"/relax/mj/submit/imagine",
		"/suno/submit/music",
		"/v1/video/generations",
		"/gemini/v1/models/gemini-3-pro-image-preview:generateContent",
		"/jimeng/v1/videos/generations",
	}

	for _, path := range mediaPaths {
		t.Run(path, func(t *testing.T) {
			recorder := performTextOnlyRequest(path)
			require.Equal(t, http.StatusNotFound, recorder.Code)
		})
	}
}

func TestTextOnlyRelayAllowsTextRoutes(t *testing.T) {
	textPaths := []string{
		"/v1/chat/completions",
		"/v1/completions",
		"/v1/responses",
		"/anthropic/messages",
		"/gemini/v1/models/gemini-3-pro-preview:generateContent",
		"/newapi/v1/chat/completions",
		"/v1/models",
	}

	for _, path := range textPaths {
		t.Run(path, func(t *testing.T) {
			recorder := performTextOnlyRequest(path)
			require.Equal(t, http.StatusNoContent, recorder.Code)
		})
	}
}
