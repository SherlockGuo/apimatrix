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
import { useState, type FormEvent } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Search,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PublicLayout } from '@/components/layout'
import { PasswordInput } from '@/components/password-input'
import { lookupToken, type TokenLookupResult } from './api'

type LookupState = 'idle' | 'loading' | 'error' | 'no-result' | 'success'

function getStatusLabel(status: number): string {
  if (status === 1) return 'Enabled'
  if (status === 2) return 'Disabled'
  if (status === 3) return 'Expired'
  if (status === 4) return 'Exhausted'
  return 'Unknown'
}

function formatQuota(value: number): string {
  return new Intl.NumberFormat().format(value)
}

export function TokenLookup() {
  const { t } = useTranslation()
  const [token, setToken] = useState('')
  const [state, setState] = useState<LookupState>('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState<TokenLookupResult | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedToken = token.trim()
    if (!trimmedToken) {
      setResult(null)
      setError(t('Enter a local API key to check.'))
      setState('error')
      return
    }

    setState('loading')
    setError('')
    setResult(null)

    try {
      const response = await lookupToken(trimmedToken)
      if (!response.success) {
        setError(t(response.message || 'Token lookup failed.'))
        setState('error')
        return
      }

      if (!response.data) {
        setState('no-result')
        return
      }

      setResult(response.data)
      setState('success')
    } catch {
      setError(t('Token lookup failed. Please try again later.'))
      setState('error')
    }
  }

  return (
    <PublicLayout showMainContainer={false}>
      <main className='bg-muted/30 flex min-h-svh items-center px-4 py-24'>
        <section className='mx-auto flex w-full max-w-2xl flex-col gap-5'>
          <div className='space-y-3 text-center'>
            <Badge
              variant='outline'
              className='mx-auto border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
            >
              <KeyRound aria-hidden='true' />
              {t('Local API key check')}
            </Badge>
            <div className='space-y-2'>
              <h1 className='text-3xl font-semibold tracking-normal sm:text-4xl'>
                {t('Token Lookup')}
              </h1>
              <p className='text-muted-foreground mx-auto max-w-xl text-sm leading-6 sm:text-base'>
                {t(
                  'Check whether a locally issued API key exists in this service. This does not reveal or validate the upstream provider credential.'
                )}
              </p>
            </div>
          </div>

          <Card className='bg-background/95 rounded-lg border shadow-sm'>
            <CardHeader>
              <CardTitle>{t('Check a local key')}</CardTitle>
              <CardDescription>
                {t(
                  'Enter a local user API key such as sk-... to search your token records.'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className='flex flex-col gap-3 sm:flex-row'
                onSubmit={handleSubmit}
              >
                <PasswordInput
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder='sk-...'
                  autoComplete='off'
                  spellCheck={false}
                  disabled={state === 'loading'}
                  className='flex-1'
                  aria-label={t('Local API key')}
                />
                <Button
                  type='submit'
                  disabled={state === 'loading'}
                  className='sm:w-32'
                >
                  {state === 'loading' ? (
                    <Loader2 className='animate-spin' aria-hidden='true' />
                  ) : (
                    <Search aria-hidden='true' />
                  )}
                  {state === 'loading' ? t('Checking') : t('Query')}
                </Button>
              </form>

              <div className='mt-5'>
                {state === 'idle' && (
                  <Alert className='border-border bg-muted/40'>
                    <KeyRound aria-hidden='true' />
                    <AlertTitle>{t('Ready to check')}</AlertTitle>
                    <AlertDescription>
                      {t('Only locally issued user API keys are checked here.')}
                    </AlertDescription>
                  </Alert>
                )}

                {state === 'loading' && (
                  <Alert className='border-border bg-muted/40'>
                    <Loader2 className='animate-spin' aria-hidden='true' />
                    <AlertTitle>{t('Checking token')}</AlertTitle>
                    <AlertDescription>
                      {t('Searching local token records...')}
                    </AlertDescription>
                  </Alert>
                )}

                {state === 'error' && (
                  <Alert variant='destructive'>
                    <AlertCircle aria-hidden='true' />
                    <AlertTitle>{t('Lookup error')}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {state === 'no-result' && (
                  <Alert className='border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200'>
                    <AlertCircle aria-hidden='true' />
                    <AlertTitle>{t('No local key found')}</AlertTitle>
                    <AlertDescription className='text-amber-800 dark:text-amber-200/90'>
                      {t(
                        'No matching local user API key was found for this token.'
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {state === 'success' && result && (
                  <Alert className='border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'>
                    <CheckCircle2 aria-hidden='true' />
                    <AlertTitle>{t('Local key found')}</AlertTitle>
                    <AlertDescription className='text-emerald-800 dark:text-emerald-200/90'>
                      <div className='mt-2 grid gap-2 text-sm sm:grid-cols-2'>
                        <div>
                          <span className='font-medium'>{t('Name')}:</span>{' '}
                          {result.name || t('Unnamed key')}
                        </div>
                        <div>
                          <span className='font-medium'>{t('Status')}:</span>{' '}
                          {t(getStatusLabel(result.status))}
                        </div>
                        <div>
                          <span className='font-medium'>
                            {t('Remaining quota')}:
                          </span>{' '}
                          {result.unlimited_quota
                            ? t('Unlimited')
                            : formatQuota(result.remain_quota)}
                        </div>
                        <div>
                          <span className='font-medium'>
                            {t('Used quota')}:
                          </span>{' '}
                          {formatQuota(result.used_quota)}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </PublicLayout>
  )
}
