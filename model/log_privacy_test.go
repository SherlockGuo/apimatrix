package model

import (
	"net/http/httptest"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestRecordConsumeLogRedactsContent(t *testing.T) {
	truncateTables(t)
	common.LogConsumeEnabled = true
	t.Cleanup(func() {
		common.LogConsumeEnabled = true
	})

	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = httptest.NewRequest("POST", "/v1/chat/completions", nil)
	ctx.Set("username", "privacy-user")

	RecordConsumeLog(ctx, 1, RecordConsumeLogParams{
		Content:          "user prompt: please summarize this private text",
		ModelName:        "gpt-5.4",
		TokenName:        "default-token",
		PromptTokens:     10,
		CompletionTokens: 5,
		Quota:            1,
	})

	var log Log
	require.NoError(t, LOG_DB.First(&log).Error)
	require.Equal(t, common.RedactedLogContent, log.Content)
	require.NotContains(t, log.Content, "private text")
}

func TestRecordTaskBillingLogRedactsRequestRelatedContent(t *testing.T) {
	truncateTables(t)
	common.LogConsumeEnabled = true

	RecordTaskBillingLog(RecordTaskBillingLogParams{
		UserId:    1,
		LogType:   LogTypeConsume,
		Content:   "prompt: generate private media description",
		ModelName: "text-model",
	})

	var log Log
	require.NoError(t, LOG_DB.First(&log).Error)
	require.Equal(t, common.RedactedLogContent, log.Content)
	require.NotContains(t, log.Content, "private media")
}
