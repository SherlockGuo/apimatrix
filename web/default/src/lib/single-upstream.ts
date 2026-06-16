/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
export const CROSS_BORDER_UPSTREAM_BASE_URL = 'http://211.136.118.26:32001'

export const CROSS_BORDER_TEXT_MODELS = [
  {
    model: 'claude-haiku-4-5-20251001',
    vendor: 'Anthropic',
    scenario: 'Fast lightweight work',
  },
  {
    model: 'claude-sonnet-4-6',
    vendor: 'Anthropic',
    scenario: 'General purpose',
  },
  {
    model: 'claude-opus-4-6',
    vendor: 'Anthropic',
    scenario: 'Complex reasoning',
  },
  {
    model: 'DeepSeek-V3.2',
    vendor: 'DeepSeek',
    scenario: 'Code and reasoning',
  },
  {
    model: 'Doubao-Seed-2.0-Pro',
    vendor: 'ByteDance',
    scenario: 'General purpose',
  },
  {
    model: 'gemini-3.1-pro-preview',
    vendor: 'Google',
    scenario: 'Complex text understanding',
  },
  { model: 'gemini-3-pro-preview', vendor: 'Google', scenario: 'Complex work' },
  {
    model: 'gemini-flash-latest',
    vendor: 'Google',
    scenario: 'Fast responses',
  },
  { model: 'GLM-4.7', vendor: 'Zhipu AI', scenario: 'General purpose' },
  { model: 'GLM-5', vendor: 'Zhipu AI', scenario: 'Complex reasoning' },
  { model: 'gpt-5.2', vendor: 'OpenAI', scenario: 'General purpose' },
  { model: 'gpt-5.3-codex', vendor: 'OpenAI', scenario: 'Code generation' },
  { model: 'gpt-5.4', vendor: 'OpenAI', scenario: 'General purpose' },
  { model: 'Kimi-K2.5', vendor: 'Moonshot AI', scenario: 'Long context' },
  {
    model: 'MiniMax-M2.5',
    vendor: 'MiniMax',
    scenario: 'General conversation',
  },
  {
    model: 'MiniMax-M2.7',
    vendor: 'MiniMax',
    scenario: 'High quality dialogue',
  },
  { model: 'Qwen3.5-Plus', vendor: 'Alibaba', scenario: 'Fast chat' },
  { model: 'Qwen3-Max', vendor: 'Alibaba', scenario: 'Complex work' },
  {
    model: 'qwen3-vl-plus',
    vendor: 'Alibaba',
    scenario: 'Document and text understanding',
  },
  {
    model: 'Tencent-HY-2.0-Instruct',
    vendor: 'Tencent',
    scenario: 'General purpose',
  },
  {
    model: 'Tencent-HY-2.0-Think',
    vendor: 'Tencent',
    scenario: 'Deep thinking',
  },
] as const

export const CROSS_BORDER_PROTOCOL_HINTS = [
  'Text models can use the OpenAI-compatible /v1/chat/completions endpoint.',
  'Claude models can also use the Anthropic-compatible ' +
    '/anthropic/messages endpoint.',
  'Gemini text models use Gemini generateContent endpoints.',
  'Image, video, and TTS endpoints are intentionally not exposed in this deployment.',
] as const
