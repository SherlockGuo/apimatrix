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
import {
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Route,
  Shield,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSystemConfig } from '@/hooks/use-system-config'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PublicLayout } from '@/components/layout'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()

  const protocols = [
    t('OpenAI-compatible'),
    t('Claude Messages'),
    t('Gemini text'),
    t('NewAPI routes'),
  ]

  const assurances = [
    {
      icon: Shield,
      title: t('No request content is recorded'),
      desc: t(
        'Only model, token usage, status, timing and billing metadata are retained.'
      ),
    },
    {
      icon: Route,
      title: t('One upstream provider'),
      desc: t(
        'All supported text protocols route through the configured provider key.'
      ),
    },
    {
      icon: KeyRound,
      title: t('Local keys for users'),
      desc: t(
        'Users call this gateway with local keys; the upstream provider credential stays server-side.'
      ),
    },
  ]

  return (
    <PublicLayout
      showMainContainer={false}
      showAuthButtons={false}
      showNotifications={false}
    >
      <main className='bg-muted/30 flex min-h-svh items-center px-4 py-24'>
        <div className='mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_480px]'>
          <section className='space-y-7'>
            <Badge
              variant='outline'
              className='border-primary/20 bg-primary/5 text-primary rounded-full px-3 py-1'
            >
              <LockKeyhole className='size-3.5' aria-hidden='true' />
              {t('Protected text model access')}
            </Badge>

            <div className='max-w-2xl space-y-4'>
              <h1 className='text-4xl leading-tight font-semibold tracking-normal sm:text-5xl'>
                {t('Unified text API console')}
              </h1>
              <p className='text-muted-foreground text-base leading-7 sm:text-lg'>
                {t(
                  'Sign in to manage local keys, quota and usage for one upstream text API service.'
                )}
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              {protocols.map((protocol) => (
                <span
                  key={protocol}
                  className='bg-background text-muted-foreground rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm'
                >
                  {protocol}
                </span>
              ))}
            </div>

            <div className='grid gap-3 md:grid-cols-3 lg:max-w-4xl'>
              {assurances.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className='bg-background/80 rounded-lg border p-4 shadow-sm'
                  >
                    <Icon
                      className='text-primary mb-3 size-4'
                      aria-hidden='true'
                    />
                    <h2 className='text-sm font-semibold'>{item.title}</h2>
                    <p className='text-muted-foreground mt-2 text-xs leading-5'>
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className='flex flex-wrap gap-3'>
              <Button variant='outline' render={<Link to='/docs' />}>
                <CheckCircle2 aria-hidden='true' />
                {t('Read the docs')}
              </Button>
              <Button variant='ghost' render={<Link to='/key' />}>
                <KeyRound aria-hidden='true' />
                {t('Check token')}
              </Button>
            </div>
          </section>

          <section
            aria-label={t('Authentication form')}
            className='bg-background/95 rounded-lg border p-5 shadow-sm sm:p-7'
          >
            <div className='mb-6 border-b pb-4'>
              <p className='text-muted-foreground text-xs font-medium tracking-widest uppercase'>
                {systemName}
              </p>
              <p className='mt-2 text-sm font-medium'>
                {t('Access your API gateway account')}
              </p>
            </div>
            {children}
          </section>
        </div>
      </main>
    </PublicLayout>
  )
}
