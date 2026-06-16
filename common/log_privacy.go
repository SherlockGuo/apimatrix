package common

import (
	"fmt"
	"strings"
)

const RedactedLogContent = "[content redacted for privacy]"

func RedactLogContent(content string) string {
	if strings.TrimSpace(content) == "" {
		return ""
	}
	return RedactedLogContent
}

func RedactedBodyLog(label string, size int) string {
	if size < 0 {
		size = 0
	}
	return fmt.Sprintf("%s omitted for privacy (bytes=%d)", label, size)
}
