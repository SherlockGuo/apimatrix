package claude

import (
	"testing"

	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/stretchr/testify/require"
)

func TestGetRequestURLNormalizesAnthropicCompatibilityPath(t *testing.T) {
	adaptor := Adaptor{}
	url, err := adaptor.GetRequestURL(&relaycommon.RelayInfo{
		ChannelMeta: &relaycommon.ChannelMeta{
			ChannelBaseUrl: "http://upstream.example",
		},
		RequestURLPath: "/anthropic/messages",
	})

	require.NoError(t, err)
	require.Equal(t, "http://upstream.example/v1/messages", url)
}

func TestGetRequestURLNormalizesAnthropicV1CompatibilityPath(t *testing.T) {
	adaptor := Adaptor{}
	url, err := adaptor.GetRequestURL(&relaycommon.RelayInfo{
		ChannelMeta: &relaycommon.ChannelMeta{
			ChannelBaseUrl: "http://upstream.example",
		},
		RequestURLPath: "/anthropic/v1/messages",
	})

	require.NoError(t, err)
	require.Equal(t, "http://upstream.example/v1/messages", url)
}

func TestGetRequestURLPreservesClaudeBetaQueryAfterPathNormalization(t *testing.T) {
	adaptor := Adaptor{}
	url, err := adaptor.GetRequestURL(&relaycommon.RelayInfo{
		ChannelMeta: &relaycommon.ChannelMeta{
			ChannelBaseUrl: "http://upstream.example",
		},
		RequestURLPath:    "/anthropic/v1/messages",
		IsClaudeBetaQuery: true,
	})

	require.NoError(t, err)
	require.Equal(t, "http://upstream.example/v1/messages?beta=true", url)
}
