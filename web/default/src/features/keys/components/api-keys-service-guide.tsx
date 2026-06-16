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
import { Link } from '@tanstack/react-router'
import { BookOpenText, KeyRound, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

const accessItems = [
  {
    title: 'OpenAI compatible',
    value: '/v1/chat/completions',
  },
  {
    title: 'Claude Messages',
    value: '/anthropic/messages',
  },
  {
    title: 'Gemini native',
    value: '/gemini/v1/models/{model}:generateContent',
  },
]

export function ApiKeysServiceGuide() {
  const { t } = useTranslation()

  return (
    <div className='bg-card overflow-hidden rounded-lg border shadow-xs'>
      <div className='grid gap-0 lg:grid-cols-[minmax(0,1fr)_22rem]'>
        <div className='space-y-4 p-4 sm:p-5'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div className='min-w-0 space-y-1.5'>
              <div className='flex items-center gap-2 text-sm font-semibold'>
                <KeyRound className='text-primary size-4' />
                {t('Create once, call text models through compatible routes')}
              </div>
              <p className='text-muted-foreground max-w-3xl text-sm leading-relaxed'>
                {t(
                  'Use the same local key for OpenAI-compatible chat, Claude Messages, and Gemini native text requests. Image, video, and TTS routes are not enabled for this service.'
                )}
              </p>
            </div>
            <Button size='sm' variant='outline' render={<Link to='/docs' />}>
              <BookOpenText className='size-4' />
              {t('View Docs')}
            </Button>
          </div>

          <div className='grid gap-2 md:grid-cols-3'>
            {accessItems.map((item) => (
              <div
                key={item.title}
                className='bg-muted/30 rounded-md border px-3 py-2.5'
              >
                <div className='text-xs font-medium'>{t(item.title)}</div>
                <div className='text-muted-foreground mt-1 truncate font-mono text-[11px]'>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='border-t p-4 sm:p-5 lg:border-t-0 lg:border-l'>
          <div className='flex items-start gap-3'>
            <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md'>
              <ShieldCheck className='size-4' />
            </div>
            <div className='min-w-0 space-y-1'>
              <div className='text-sm font-semibold'>
                {t('Request content is not stored')}
              </div>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {t(
                  'Usage logs keep billing and status metadata only. Prompt, message, file, and response bodies are redacted before being written to logs.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
