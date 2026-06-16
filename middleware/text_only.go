package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

var textOnlyBlockedPathPrefixes = []string{
	"/mj",
	"/suno",
	"/kling",
	"/jimeng",
	"/v1/edits",
	"/v1/audio/",
	"/v1/images/",
	"/v1/video/",
	"/v1/videos",
	"/v1/realtime",
}

var textOnlyBlockedPathFragments = []string{
	"/images/",
	"/audio/",
	"/video/",
	"/videos/",
	"/mj/",
	"-image-",
	"image-preview",
}

func isTextOnlyBlockedRelayPath(path string) bool {
	normalized := strings.ToLower(strings.TrimSpace(path))
	for _, prefix := range textOnlyBlockedPathPrefixes {
		if strings.HasPrefix(normalized, prefix) {
			return true
		}
	}
	for _, fragment := range textOnlyBlockedPathFragments {
		if strings.Contains(normalized, fragment) {
			return true
		}
	}
	return false
}

func TextOnlyRelay() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == http.MethodOptions {
			c.Next()
			return
		}
		if isTextOnlyBlockedRelayPath(c.Request.URL.Path) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": gin.H{
					"message": "This deployment only exposes text model APIs.",
					"type":    "not_found_error",
				},
			})
			return
		}
		c.Next()
	}
}
