package claude

import (
	"testing"

	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/stretchr/testify/require"
)

func TestGetRequestURLUsesAnthropicCompatibilityPath(t *testing.T) {
	adaptor := Adaptor{}
	url, err := adaptor.GetRequestURL(&relaycommon.RelayInfo{
		ChannelMeta: &relaycommon.ChannelMeta{
			ChannelBaseUrl: "http://upstream.example",
		},
		RequestURLPath: "/anthropic/messages",
	})

	require.NoError(t, err)
	require.Equal(t, "http://upstream.example/anthropic/messages", url)
}
