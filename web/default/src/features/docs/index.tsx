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
import { type ComponentProps, type ReactNode, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  CheckCircle2,
  KeyRound,
  ListChecks,
  Terminal,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CROSS_BORDER_TEXT_MODELS } from '@/lib/single-upstream'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CodeBlock,
  CodeBlockCopyButton,
} from '@/components/ai-elements/code-block'
import { StaticDataTable } from '@/components/data-table'
import { PublicLayout } from '@/components/layout'

type CodeLanguage = ComponentProps<typeof CodeBlock>['language']

type NavSection = {
  group: string
  links: Array<{ href: string; label: string }>
}

type ModelGroup = {
  protocol: string
  title: string
  models: string[]
}

type SummaryRow = {
  type: string
  endpoint: string
  auth: string
  status: string
}

const navSections: NavSection[] = [
  {
    group: '入门',
    links: [
      { href: '#overview', label: '概述' },
      { href: '#basic', label: '基本信息' },
      { href: '#ping', label: '连通性测试' },
      { href: '#models', label: '模型清单' },
    ],
  },
  {
    group: '调用示例',
    links: [
      { href: '#openai-text', label: 'OpenAI 兼容文本' },
      { href: '#claude', label: 'Claude · Anthropic' },
      { href: '#gemini', label: 'Gemini · 原生协议' },
      { href: '#newapi-text', label: 'NewAPI 兼容文本' },
    ],
  },
  {
    group: '进阶',
    links: [
      { href: '#thinking', label: 'Claude thinking' },
      { href: '#summary', label: '接入方式汇总' },
      { href: '#privacy', label: '隐私与日志' },
      { href: '#errors', label: '错误与重试' },
      { href: '#notes', label: '接入注意事项' },
    ],
  },
]

const preferredModelOrder = [
  'gpt-5.4',
  'gpt-5.3-codex',
  'gpt-5.2',
  'DeepSeek-V3.2',
  'GLM-5',
  'GLM-4.7',
  'Kimi-K2.5',
  'Qwen3-Max',
  'Qwen3.5-Plus',
  'qwen3-vl-plus',
]

const modelGroups: ModelGroup[] = [
  {
    protocol: 'Anthropic',
    title: 'Claude 文本',
    models: CROSS_BORDER_TEXT_MODELS.filter(
      (item) => item.vendor === 'Anthropic'
    ).map((item) => item.model),
  },
  {
    protocol: 'OpenAI',
    title: 'GPT / DeepSeek / GLM / Kimi / Qwen',
    models: preferredModelOrder.filter((model) =>
      CROSS_BORDER_TEXT_MODELS.some((item) => item.model === model)
    ),
  },
  {
    protocol: 'OpenAI',
    title: '豆包 / MiniMax / 腾讯混元',
    models: CROSS_BORDER_TEXT_MODELS.filter((item) =>
      ['ByteDance', 'MiniMax', 'Tencent'].includes(item.vendor)
    ).map((item) => item.model),
  },
  {
    protocol: 'Gemini',
    title: 'Gemini 文本',
    models: CROSS_BORDER_TEXT_MODELS.filter(
      (item) => item.vendor === 'Google'
    ).map((item) => item.model),
  },
]

const summaryRows: SummaryRow[] = [
  {
    type: '全部文本模型',
    endpoint: 'POST /v1/chat/completions',
    auth: 'Authorization: Bearer <YOUR_API_KEY>',
    status: '推荐',
  },
  {
    type: 'Claude 原生消息',
    endpoint: 'POST /anthropic/v1/messages',
    auth: 'x-api-key: <YOUR_API_KEY>',
    status: '推荐',
  },
  {
    type: 'Gemini 原生内容生成',
    endpoint: 'POST /gemini/v1/models/{model}:generateContent',
    auth: 'Authorization: Bearer <YOUR_API_KEY>',
    status: '推荐',
  },
  {
    type: 'NewAPI 兼容文本',
    endpoint: 'POST /newapi/v1/chat/completions',
    auth: 'Authorization: Bearer <YOUR_API_KEY>',
    status: '可选',
  },
]

function getClientBaseUrl() {
  if (typeof window === 'undefined') return 'https://your-domain.example'
  return window.location.origin
}

function CodeSnippet({
  code,
  language = 'bash',
  className,
}: {
  code: string
  language?: CodeLanguage
  className?: string
}) {
  const { t } = useTranslation()

  return (
    <CodeBlock
      code={code}
      language={language}
      className={cn('rounded-lg', className)}
    >
      <CodeBlockCopyButton aria-label={t('Copy code')} />
    </CodeBlock>
  )
}

function DocsSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow?: string
  title: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className='scroll-mt-24 space-y-4'>
      <div className='space-y-1'>
        {eyebrow && (
          <Badge
            variant='outline'
            className='border-emerald-200 text-emerald-700'
          >
            {eyebrow}
          </Badge>
        )}
        <h2 className='text-2xl font-semibold tracking-normal'>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className='bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[0.9em]'>
      {children}
    </code>
  )
}

function ModelGroupBlock({ group }: { group: ModelGroup }) {
  return (
    <div className='bg-background rounded-lg border p-4'>
      <div className='mb-3 flex flex-wrap items-center gap-2'>
        <Badge>{group.protocol}</Badge>
        <span className='text-sm font-medium'>{group.title}</span>
      </div>
      <div className='flex flex-wrap gap-2'>
        {group.models.map((model) => (
          <Badge
            key={model}
            variant='outline'
            className='h-auto rounded-md px-2 py-1 font-mono text-[11px]'
          >
            {model}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export function Docs() {
  const baseUrl = getClientBaseUrl()
  const snippets = useMemo(
    () => ({
      models: `curl "${baseUrl}/v1/models" \\
  -H "Authorization: Bearer <YOUR_API_KEY>"`,
      openai: `curl "${baseUrl}/v1/chat/completions" \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5.4",
    "messages": [
      {"role": "user", "content": "请用一句话介绍你自己"}
    ],
    "max_tokens": 512
  }'`,
      openaiPython: `from openai import OpenAI

client = OpenAI(
    api_key="<YOUR_API_KEY>",
    base_url="${baseUrl}/v1",
)

response = client.chat.completions.create(
    model="gpt-5.4",
    messages=[{"role": "user", "content": "请用一句话介绍你自己"}],
    max_tokens=512,
)
print(response.choices[0].message.content)`,
      claude: `curl "${baseUrl}/anthropic/v1/messages" \\
  -H "x-api-key: <YOUR_API_KEY>" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "请用一句话介绍你自己"}
    ]
  }'`,
      gemini: `curl "${baseUrl}/gemini/v1/models/gemini-3-pro-preview:generateContent" \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [
      {
        "parts": [
          {"text": "请用一句话介绍你自己"}
        ]
      }
    ]
  }'`,
      newapi: `curl "${baseUrl}/newapi/v1/chat/completions" \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "DeepSeek-V3.2",
    "messages": [
      {"role": "user", "content": "请用一句话介绍你自己"}
    ],
    "temperature": 0.7
  }'`,
      thinking: `{
  "model": "claude-sonnet-4-6",
  "max_tokens": 4096,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 2048
  },
  "messages": [
    {
      "role": "user",
      "content": "证明根号 2 是无理数，并写出完整步骤"
    }
  ]
}`,
    }),
    [baseUrl]
  )

  return (
    <PublicLayout showMainContainer={false}>
      <main className='bg-muted/20 min-h-svh px-4 pt-24 pb-16'>
        <div className='mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[240px_minmax(0,1fr)]'>
          <aside className='hidden lg:block'>
            <div className='bg-background sticky top-24 rounded-lg border p-4 shadow-sm'>
              <div className='mb-4 flex items-center gap-2 text-sm font-semibold'>
                <BookOpen className='size-4 text-emerald-600' />
                API 接入文档
              </div>
              <nav className='space-y-5'>
                {navSections.map((section) => (
                  <div key={section.group} className='space-y-2'>
                    <div className='text-muted-foreground text-xs font-medium'>
                      {section.group}
                    </div>
                    <div className='space-y-1'>
                      {section.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className='text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-2 py-1.5 text-sm transition-colors'
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          <article className='min-w-0 space-y-10'>
            <section id='overview' className='scroll-mt-24 space-y-5'>
              <Badge
                variant='outline'
                className='border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
              >
                客户接入说明
              </Badge>
              <div className='space-y-3'>
                <h1 className='max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl'>
                  统一接口，接入主流大模型
                </h1>
                <p className='text-muted-foreground max-w-3xl text-base leading-7'>
                  一个 API Key 即可调用 Claude、GPT、Gemini、DeepSeek、GLM、
                  Kimi、Qwen、MiniMax、豆包、腾讯混元等文本模型。本文档面向技术接入方，
                  对每类模型给出推荐调用方式，降低接入歧义。
                </p>
              </div>
              <div className='grid gap-3 md:grid-cols-3'>
                <div className='bg-background rounded-lg border p-4'>
                  <KeyRound className='mb-3 size-5 text-emerald-600' />
                  <div className='text-sm font-medium'>Bearer Key 鉴权</div>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    使用平台签发的本地 API Key，不暴露上游供应商密钥。
                  </p>
                </div>
                <div className='bg-background rounded-lg border p-4'>
                  <Terminal className='mb-3 size-5 text-sky-600' />
                  <div className='text-sm font-medium'>OpenAI 兼容优先</div>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    文本模型优先使用{' '}
                    <InlineCode>/v1/chat/completions</InlineCode>。
                  </p>
                </div>
                <div className='bg-background rounded-lg border p-4'>
                  <ListChecks className='mb-3 size-5 text-violet-600' />
                  <div className='text-sm font-medium'>模型可见性跟随账号</div>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    <InlineCode>/v1/models</InlineCode> 返回当前 Key
                    可访问的模型集合。
                  </p>
                </div>
              </div>
            </section>

            <DocsSection id='basic' title='基本信息'>
              <div className='grid gap-3 md:grid-cols-3'>
                <InfoTile label='Base URL' value={baseUrl} />
                <InfoTile label='鉴权方式' value='Bearer Key / x-api-key' />
                <InfoTile label='模型列表接口' value='GET /v1/models' />
              </div>
              <ul className='text-muted-foreground list-disc space-y-2 pl-5 text-sm leading-6'>
                <li>同一个 API Key 可访问当前账号下全部已开放模型。</li>
                <li>接入时请直接按本文档给出的方式调用对应模型。</li>
                <li>
                  如果只想先验证 Key 是否可用，建议先调用{' '}
                  <InlineCode>/v1/models</InlineCode>。
                </li>
              </ul>
            </DocsSection>

            <DocsSection id='ping' title='快速连通性测试'>
              <p className='text-muted-foreground text-sm leading-6'>
                返回 <InlineCode>data</InlineCode> 数组，说明 Key
                与平台链路正常。
              </p>
              <CodeSnippet code={snippets.models} />
            </DocsSection>

            <DocsSection id='models' title='模型清单'>
              <p className='text-muted-foreground text-sm leading-6'>
                按协议归类如下。同类模型切换时通常只需替换{' '}
                <InlineCode>model</InlineCode> 字段。
              </p>
              <div className='grid gap-3 md:grid-cols-2'>
                {modelGroups.map((group) => (
                  <ModelGroupBlock
                    key={`${group.protocol}-${group.title}`}
                    group={group}
                  />
                ))}
              </div>
            </DocsSection>

            <DocsSection
              id='openai-text'
              eyebrow='OpenAI'
              title='GPT / DeepSeek / GLM / Kimi / Qwen 文本'
            >
              <p className='text-muted-foreground text-sm leading-6'>
                接口：<InlineCode>POST /v1/chat/completions</InlineCode>。
                切换同类模型时只需替换 <InlineCode>model</InlineCode>。
              </p>
              <div className='grid gap-4 xl:grid-cols-2'>
                <CodeSnippet code={snippets.openai} />
                <CodeSnippet code={snippets.openaiPython} language='python' />
              </div>
              <Alert className='border-sky-200 bg-sky-50/80 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100'>
                <CheckCircle2 aria-hidden='true' />
                <AlertTitle>推荐接入方式</AlertTitle>
                <AlertDescription>
                  Claude、Gemini 以外的文本模型推荐都走 OpenAI
                  兼容接口。部分推理模型会消耗较多输出 token， 建议设置足够的{' '}
                  <InlineCode>max_tokens</InlineCode>。
                </AlertDescription>
              </Alert>
            </DocsSection>

            <DocsSection id='claude' eyebrow='Anthropic' title='Claude 文本'>
              <p className='text-muted-foreground text-sm leading-6'>
                推荐接口：<InlineCode>POST /anthropic/v1/messages</InlineCode>。
                同时兼容 <InlineCode>POST /anthropic/messages</InlineCode> 与{' '}
                <InlineCode>POST /v1/messages</InlineCode>。
                鉴权头为 <InlineCode>x-api-key</InlineCode>，需带{' '}
                <InlineCode>anthropic-version</InlineCode>。
              </p>
              <CodeSnippet code={snippets.claude} />
            </DocsSection>

            <DocsSection
              id='gemini'
              eyebrow='Gemini'
              title='Gemini 文本 · 原生协议'
            >
              <p className='text-muted-foreground text-sm leading-6'>
                接口：
                <InlineCode>
                  POST /gemini/v1/models/{'{model}'}:generateContent
                </InlineCode>
                。 鉴权头使用 <InlineCode>Authorization: Bearer</InlineCode>。
              </p>
              <CodeSnippet code={snippets.gemini} />
              <Alert>
                <AlertTitle>兼容路径</AlertTitle>
                <AlertDescription>
                  也可以使用{' '}
                  <InlineCode>
                    /v1beta/models/{'{model}'}:generateContent
                  </InlineCode>{' '}
                  并通过 <InlineCode>x-goog-api-key</InlineCode>{' '}
                  鉴权，便于兼容已有 Gemini SDK。
                </AlertDescription>
              </Alert>
            </DocsSection>

            <DocsSection
              id='newapi-text'
              eyebrow='NewAPI'
              title='NewAPI 兼容文本'
            >
              <p className='text-muted-foreground text-sm leading-6'>
                接口：
                <InlineCode>POST /newapi/v1/chat/completions</InlineCode>。
                该路径保留给已经按 NewAPI 文档集成的客户，入参和 OpenAI
                兼容聊天接口保持一致。
              </p>
              <CodeSnippet code={snippets.newapi} />
            </DocsSection>

            <DocsSection id='thinking' title='Claude thinking 使用说明'>
              <p className='text-muted-foreground text-sm leading-6'>
                如需 Claude thinking，可在 Anthropic 接口里传入{' '}
                <InlineCode>thinking</InlineCode> 参数。普通聊天不需要传该字段。
              </p>
              <CodeSnippet code={snippets.thinking} language='json' />
            </DocsSection>

            <DocsSection id='summary' title='模型接入方式汇总'>
              <StaticDataTable
                columns={[
                  { id: 'type', header: '模型类型', cell: (row) => row.type },
                  {
                    id: 'endpoint',
                    header: '接入方式',
                    cell: (row) => <InlineCode>{row.endpoint}</InlineCode>,
                  },
                  { id: 'auth', header: '鉴权', cell: (row) => row.auth },
                  {
                    id: 'status',
                    header: '状态',
                    cell: (row) => (
                      <Badge
                        variant={row.status === '推荐' ? 'default' : 'outline'}
                      >
                        {row.status}
                      </Badge>
                    ),
                  },
                ]}
                data={summaryRows}
                getRowKey={(row) => row.type}
              />
            </DocsSection>

            <DocsSection id='privacy' title='隐私与日志记录'>
              <div className='grid gap-3 md:grid-cols-2'>
                <div className='bg-background rounded-lg border p-4'>
                  <div className='text-sm font-semibold'>请求内容不落库</div>
                  <p className='text-muted-foreground mt-2 text-sm leading-6'>
                    平台不会在使用日志、钱包记录、错误日志中保存 prompt、
                    messages、response body、文件内容或其他请求正文。日志仅保留模型、
                    token、状态码、耗时、计费用量等运营元数据。
                  </p>
                </div>
                <div className='bg-background rounded-lg border p-4'>
                  <div className='text-sm font-semibold'>密钥本地管理</div>
                  <p className='text-muted-foreground mt-2 text-sm leading-6'>
                    客户只使用平台签发的本地 API Key。上游供应商 Key
                    由服务端统一配置，不需要在客户端、脚本或业务系统中暴露。
                  </p>
                </div>
              </div>
              <Alert className='border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100'>
                <CheckCircle2 aria-hidden='true' />
                <AlertTitle>合规接入建议</AlertTitle>
                <AlertDescription>
                  如业务侧需要留存会话内容，请在自己的系统中按业务合规要求处理。
                  本平台侧只作为文本模型 API 网关转发与计费，不提供请求内容回溯。
                </AlertDescription>
              </Alert>
            </DocsSection>

            <DocsSection id='errors' title='错误与重试建议'>
              <div className='bg-background overflow-hidden rounded-lg border'>
                <div className='grid gap-0 divide-y md:grid-cols-2 md:divide-x md:divide-y-0'>
                  <div className='p-4'>
                    <div className='text-sm font-semibold'>鉴权或额度错误</div>
                    <ul className='text-muted-foreground mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6'>
                      <li>
                        <InlineCode>401</InlineCode>：检查 API Key
                        是否完整，建议使用 <InlineCode>sk-</InlineCode>{' '}
                        开头的令牌。
                      </li>
                      <li>
                        <InlineCode>403</InlineCode>：当前 Key
                        无模型权限或账号状态不可用。
                      </li>
                      <li>
                        <InlineCode>429</InlineCode>：触发速率限制或余额不足，
                        可降低并发或检查钱包余额。
                      </li>
                    </ul>
                  </div>
                  <div className='p-4'>
                    <div className='text-sm font-semibold'>上游或网络错误</div>
                    <ul className='text-muted-foreground mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6'>
                      <li>
                        <InlineCode>5xx</InlineCode>
                        ：按指数退避重试，避免固定频率快速重放。
                      </li>
                      <li>流式请求请监听连接关闭，并按业务幂等策略决定是否重试。</li>
                      <li>
                        排查时优先提供请求时间、模型名、状态码和日志 ID，
                        不需要提供请求正文。
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </DocsSection>

            <DocsSection id='notes' title='接入注意事项'>
              <ul className='text-muted-foreground list-disc space-y-2 pl-5 text-sm leading-6'>
                <li>
                  <InlineCode>GET /v1/models</InlineCode> 返回的是当前 Key
                  可见的模型集合，接入前建议先拉取一次。
                </li>
                <li>接入时请直接采用本文档对应模型的接口与请求格式。</li>
                <li>Gemini 系列可使用本文档中的原生接口与请求格式。</li>
                <li>
                  如只需要统一文本调用，全部文本模型都可以优先使用 OpenAI
                  兼容接口。
                </li>
                <li>
                  需要查询本地 Key 状态时，可使用公开的{' '}
                  <Button
                    variant='link'
                    className='h-auto px-0'
                    render={<Link to='/key' />}
                  >
                    令牌查询
                  </Button>
                  。
                </li>
              </ul>
            </DocsSection>
          </article>
        </div>
      </main>
    </PublicLayout>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className='bg-background rounded-lg border p-4'>
      <div className='text-muted-foreground text-xs font-medium'>{label}</div>
      <div className='mt-2 font-mono text-sm break-all'>{value}</div>
    </div>
  )
}
