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
import { useQuery } from '@tanstack/react-query'
import { BookOpen, KeyRound, LockKeyhole, Route, Scale } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Markdown } from '@/components/ui/markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { PublicLayout } from '@/components/layout'
import { getAboutContent } from './api'

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isLikelyHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

function DefaultAboutContent() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  const advantages = [
    {
      icon: LockKeyhole,
      title: t('Encrypted transport'),
      desc: t(
        'Requests are forwarded over protected channels and request content is not recorded by this gateway.'
      ),
    },
    {
      icon: Scale,
      title: t('Compliance first'),
      desc: t(
        'Operational controls focus on access, quota, billing metadata and auditability.'
      ),
    },
    {
      icon: Route,
      title: t('Unified text routing'),
      desc: t(
        'One local API key reaches OpenAI-compatible chat, Claude Messages and Gemini native text APIs.'
      ),
    },
    {
      icon: KeyRound,
      title: t('Local key management'),
      desc: t(
        'Users manage local API keys, balance and usage metadata without exposing the upstream provider key.'
      ),
    },
  ]

  return (
    <div className='mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:py-16'>
      <section className='space-y-5'>
        <div className='border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium'>
          <BookOpen className='size-3.5' aria-hidden='true' />
          {t('About this API service')}
        </div>
        <div className='max-w-3xl space-y-3'>
          <h1 className='text-4xl font-semibold tracking-normal sm:text-5xl'>
            {t('Secure unified model API access')}
          </h1>
          <p className='text-muted-foreground text-base leading-7'>
            {t(
              'A focused API gateway for teams that need stable access to text models through one local key, clear usage accounting, and a no request-content logging policy.'
            )}
          </p>
        </div>
      </section>

      <section className='grid gap-3 md:grid-cols-2'>
        {advantages.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.title} className='bg-card rounded-lg border p-5'>
              <Icon className='text-primary mb-4 size-5' aria-hidden='true' />
              <h2 className='text-base font-semibold'>{item.title}</h2>
              <p className='text-muted-foreground mt-2 text-sm leading-6'>
                {item.desc}
              </p>
            </div>
          )
        })}
      </section>

      <section className='bg-card rounded-lg border p-5'>
        <h2 className='text-lg font-semibold'>{t('Service scope')}</h2>
        <div className='text-muted-foreground mt-3 grid gap-3 text-sm leading-6 md:grid-cols-3'>
          <p>
            {t(
              'Text chat and reasoning models are available first, with OpenAI-compatible, Claude-compatible and Gemini-compatible routes.'
            )}
          </p>
          <p>
            {t(
              'Image, video and TTS capability pages are intentionally hidden until those integrations are enabled.'
            )}
          </p>
          <p>
            {t(
              'Billing and monitoring retain only operational metadata such as model, token usage, status and timing.'
            )}
          </p>
        </div>
      </section>

      <section className='text-muted-foreground space-y-4 border-t pt-6 text-sm'>
        <div className='space-y-3'>
          <p>
            {t('New API Project Repository:')}{' '}
            <a
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('https://github.com/QuantumNous/new-api')}
            </a>
          </p>
          <p className='text-muted-foreground'>
            <a
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('NewAPI')}
            </a>{' '}
            © {currentYear}{' '}
            <a
              href='https://github.com/QuantumNous'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('QuantumNous')}
            </a>{' '}
            {t('| Based on')}{' '}
            <a
              href='https://github.com/songquanpeng/one-api'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('One API')}
            </a>{' '}
            © 2023{' '}
            <a
              href='https://github.com/songquanpeng'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('JustSong')}
            </a>
          </p>
          <p className='text-muted-foreground'>
            {t('This project must be used in compliance with the')}{' '}
            <a
              href='https://github.com/QuantumNous/new-api/blob/main/LICENSE'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              {t('AGPL v3.0 License')}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}

export function About() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['about-content'],
    queryFn: getAboutContent,
  })

  const rawContent = data?.data?.trim() ?? ''
  const hasContent = rawContent.length > 0
  const isUrl = hasContent && isValidUrl(rawContent)
  const isHtml = hasContent && !isUrl && isLikelyHtml(rawContent)

  if (isLoading) {
    return (
      <PublicLayout>
        <div className='mx-auto flex max-w-4xl flex-col gap-4 py-12'>
          <Skeleton className='h-8 w-[45%]' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[80%]' />
        </div>
      </PublicLayout>
    )
  }

  if (!hasContent) {
    return (
      <PublicLayout>
        <DefaultAboutContent />
      </PublicLayout>
    )
  }

  if (isUrl) {
    return (
      <PublicLayout showMainContainer={false}>
        <iframe
          src={rawContent}
          className='h-[calc(100vh-3.5rem)] w-full border-0'
          title={t('About')}
        />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className='mx-auto max-w-6xl px-4 py-8'>
        {isHtml ? (
          <div
            className='prose prose-neutral dark:prose-invert max-w-none'
            dangerouslySetInnerHTML={{ __html: rawContent }}
          />
        ) : (
          <Markdown className='prose-neutral dark:prose-invert max-w-none'>
            {rawContent}
          </Markdown>
        )}
      </div>
    </PublicLayout>
  )
}
