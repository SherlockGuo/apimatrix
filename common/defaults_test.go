package common

import (
	"os"
	"testing"

	"github.com/QuantumNous/new-api/constant"
)

func TestTextOnlyDeploymentDefaults(t *testing.T) {
	if got := GetTheme(); got != "default" {
		t.Fatalf("GetTheme() = %q, want %q", got, "default")
	}
	if DrawingEnabled {
		t.Fatal("DrawingEnabled = true, want false")
	}
	if TaskEnabled {
		t.Fatal("TaskEnabled = true, want false")
	}
}

func TestUpdateTaskDefaultsOffUnlessExplicitlyEnabled(t *testing.T) {
	oldValue, hadOldValue := os.LookupEnv("UPDATE_TASK")
	defer func() {
		if hadOldValue {
			_ = os.Setenv("UPDATE_TASK", oldValue)
		} else {
			_ = os.Unsetenv("UPDATE_TASK")
		}
		initConstantEnv()
	}()

	_ = os.Unsetenv("UPDATE_TASK")
	initConstantEnv()
	if constant.UpdateTask {
		t.Fatal("constant.UpdateTask = true without UPDATE_TASK env, want false")
	}

	_ = os.Setenv("UPDATE_TASK", "true")
	initConstantEnv()
	if !constant.UpdateTask {
		t.Fatal("constant.UpdateTask = false with UPDATE_TASK=true, want true")
	}
}
