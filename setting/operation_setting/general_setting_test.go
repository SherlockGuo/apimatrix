package operation_setting

import "testing"

func TestGeneralSettingDefaultsToLocalDocs(t *testing.T) {
	if got := GetGeneralSetting().DocsLink; got != "/docs" {
		t.Fatalf("DocsLink = %q, want %q", got, "/docs")
	}
}
