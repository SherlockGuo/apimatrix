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
import { BookOpenText, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { TitledCard } from '@/components/ui/titled-card'

const items = [
  {
    icon: KeyRound,
    title: 'Local API keys',
    description:
      'Create keys from this console and use them with OpenAI-compatible, Claude, and Gemini text endpoints.',
  },
  {
    icon: LockKeyhole,
    title: 'Account protection',
    description:
      'Use password changes, passkeys, and 2FA to protect access to billing, keys, and usage data.',
  },
  {
    icon: ShieldCheck,
    title: 'No request-content logs',
    description:
      'Prompts, messages, files, and response bodies are redacted before usage logs are stored.',
  },
]

export function ProfileServiceSummaryCard() {
  const { t } = useTranslation()

  return (
    <TitledCard
      title={t('Service Access')}
      description={t(
        'Manage the account used for text API access, billing, and local key security.'
      )}
      icon={<ShieldCheck className='size-4' />}
      action={
        <div className='grid grid-cols-2 gap-2 sm:flex'>
          <Button size='sm' variant='outline' render={<Link to='/docs' />}>
            <BookOpenText className='size-4' />
            {t('Docs')}
          </Button>
          <Button size='sm' render={<Link to='/keys' />}>
            <KeyRound className='size-4' />
            {t('API Keys')}
          </Button>
        </div>
      }
    >
      <div className='grid gap-3 md:grid-cols-3'>
        {items.map((item) => (
          <div key={item.title} className='bg-muted/30 rounded-lg border p-3'>
            <div className='flex items-center gap-2'>
              <div className='bg-background flex size-8 shrink-0 items-center justify-center rounded-md border'>
                <item.icon className='text-primary size-4' />
              </div>
              <div className='text-sm font-semibold'>{t(item.title)}</div>
            </div>
            <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
              {t(item.description)}
            </p>
          </div>
        ))}
      </div>
    </TitledCard>
  )
}
