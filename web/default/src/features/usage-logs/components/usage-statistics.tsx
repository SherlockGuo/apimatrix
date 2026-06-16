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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router'
import {
  BarChart3,
  Filter,
  Gauge,
  KeyRound,
  RotateCcw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import type { ComponentType, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { formatLogQuota, formatNumber } from '@/lib/format'
import { useIsAdmin } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { LOG_TYPE_ALL_VALUE, LOG_TYPE_FILTERS } from '../constants'
import { getLogStats, getUserLogStats } from '../api'
import { DEFAULT_LOG_STATS } from '../constants'
import {
  buildUsageStatisticsSearch,
  getUsageStatisticsInitialFilters,
  getUsageStatisticsInitialType,
  USAGE_STATISTICS_DEFAULT_TYPE,
} from '../lib/usage-statistics-filter'
import { buildApiParams } from '../lib/utils'
import type { CommonLogFilters } from '../types'
import { CompactDateTimeRangePicker } from './compact-date-time-range-picker'
import { LogsFilterInput } from './logs-filter-toolbar'

const route = getRouteApi('/_authenticated/usage-logs/$section')
const logTypeValues = ['0', '1', '2', '3', '4', '5', '6'] as const

type LogTypeValue = (typeof logTypeValues)[number]

function isLogTypeValue(value: string): value is LogTypeValue {
  return (logTypeValues as readonly string[]).includes(value)
}

function UsageStatCard(props: {
  title: string
  value: string
  description: string
  icon: ComponentType<{ className?: string }>
}) {
  const Icon = props.icon

  return (
    <Card className='gap-0 py-0'>
      <CardContent className='flex items-start justify-between gap-4 p-4 sm:p-5'>
        <div className='min-w-0'>
          <p className='text-muted-foreground text-xs font-medium'>
            {props.title}
          </p>
          <div className='mt-2 font-mono text-2xl font-semibold tracking-normal tabular-nums'>
            {props.value}
          </div>
          <p className='text-muted-foreground mt-2 text-xs leading-5'>
            {props.description}
          </p>
        </div>
        <span className='bg-primary/10 text-primary inline-flex size-9 shrink-0 items-center justify-center rounded-md'>
          <Icon className='size-4' />
        </span>
      </CardContent>
    </Card>
  )
}

function UsageStatsSkeleton() {
  return (
    <div className='grid gap-3 md:grid-cols-3'>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className='gap-0 py-0'>
          <CardContent className='space-y-3 p-4 sm:p-5'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-4 w-full' />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function UsageStatistics() {
  const { t } = useTranslation()
  const isAdmin = useIsAdmin()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const searchParams = route.useSearch()
  const [filters, setFilters] = useState<CommonLogFilters>(() =>
    getUsageStatisticsInitialFilters(searchParams)
  )
  const [logType, setLogType] = useState<string>(() =>
    getUsageStatisticsInitialType(searchParams)
  )

  useEffect(() => {
    setFilters(getUsageStatisticsInitialFilters(searchParams))
    setLogType(getUsageStatisticsInitialType(searchParams))
  }, [searchParams])

  const { data: stats, isLoading } = useQuery({
    queryKey: ['usage-statistics', isAdmin, searchParams],
    queryFn: async () => {
      const params = buildApiParams({
        page: 1,
        pageSize: 1,
        searchParams,
        columnFilters: [],
        isAdmin,
      })
      const result = isAdmin
        ? await getLogStats(params)
        : await getUserLogStats(params)

      return result.success
        ? result.data || DEFAULT_LOG_STATS
        : DEFAULT_LOG_STATS
    },
    placeholderData: (previousData) => previousData,
  })

  const logTypeItems = useMemo(
    () =>
      LOG_TYPE_FILTERS.map((type) => ({
        value: type.value,
        label: t(type.label),
      })),
    [t]
  )
  const logTypeLabel =
    logTypeItems.find((type) => type.value === logType)?.label ?? t('All Types')

  const handleChange = useCallback(
    (field: keyof CommonLogFilters, value: Date | string | undefined) => {
      setFilters((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleApply = useCallback(() => {
    navigate({
      to: '/usage-logs/$section',
      params: { section: 'statistics' },
      search: buildUsageStatisticsSearch({ filters, type: logType }),
    })
    queryClient.invalidateQueries({ queryKey: ['usage-statistics'] })
  }, [filters, logType, navigate, queryClient])

  const handleReset = useCallback(() => {
    const resetFilters = getUsageStatisticsInitialFilters({})
    setFilters(resetFilters)
    setLogType(USAGE_STATISTICS_DEFAULT_TYPE)
    navigate({
      to: '/usage-logs/$section',
      params: { section: 'statistics' },
      search: buildUsageStatisticsSearch({
        filters: resetFilters,
        type: USAGE_STATISTICS_DEFAULT_TYPE,
      }),
    })
    queryClient.invalidateQueries({ queryKey: ['usage-statistics'] })
  }, [navigate, queryClient])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') handleApply()
    },
    [handleApply]
  )

  const hasActiveFilters = Boolean(
    filters.model ||
      filters.token ||
      filters.group ||
      filters.username ||
      filters.channel ||
      logType !== LOG_TYPE_ALL_VALUE
  )

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <UsageStatisticsFiltersSkeleton />
        <UsageStatsSkeleton />
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Card className='gap-0 py-0'>
        <CardHeader className='border-b p-4 !pb-4 sm:p-5 sm:!pb-5'>
          <div className='flex items-start gap-3'>
            <span className='bg-primary/10 text-primary inline-flex size-9 shrink-0 items-center justify-center rounded-md'>
              <Filter className='size-4' />
            </span>
            <div>
              <h3 className='text-sm font-semibold'>
                {t('Statistics Filters')}
              </h3>
              <p className='text-muted-foreground mt-1 text-sm leading-6'>
                {t(
                  'Refine usage totals by date range, model, API key, group, user, or channel.'
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-3 p-4 sm:p-5'>
          <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-4'>
            <div className='sm:col-span-2'>
              <CompactDateTimeRangePicker
                start={filters.startTime}
                end={filters.endTime}
                onChange={({ start, end }) => {
                  handleChange('startTime', start)
                  handleChange('endTime', end)
                }}
              />
            </div>
            <LogsFilterInput
              placeholder={t('Model Name')}
              value={filters.model || ''}
              onChange={(event) => handleChange('model', event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <LogsFilterInput
              placeholder={t('Token Name')}
              value={filters.token || ''}
              onChange={(event) => handleChange('token', event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <LogsFilterInput
              placeholder={t('Group')}
              value={filters.group || ''}
              onChange={(event) => handleChange('group', event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Select
              items={logTypeItems}
              value={logType}
              onValueChange={(value) => {
                setLogType(
                  value !== null && isLogTypeValue(value)
                    ? value
                    : USAGE_STATISTICS_DEFAULT_TYPE
                )
              }}
            >
              <SelectTrigger className='h-8'>
                <SelectValue>{logTypeLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {LOG_TYPE_FILTERS.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {t(type.label)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {isAdmin && (
              <>
                <LogsFilterInput
                  placeholder={t('Username')}
                  value={filters.username || ''}
                  onChange={(event) =>
                    handleChange('username', event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />
                <LogsFilterInput
                  placeholder={t('Channel ID')}
                  value={filters.channel || ''}
                  onChange={(event) =>
                    handleChange('channel', event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />
              </>
            )}
          </div>
          <div className='flex flex-wrap items-center justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleReset}
              disabled={!hasActiveFilters}
            >
              <RotateCcw className='size-4' />
              {t('Reset')}
            </Button>
            <Button type='button' onClick={handleApply}>
              <Search className='size-4' />
              {t('Search')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-3 md:grid-cols-3'>
        <UsageStatCard
          title={t('Total Usage')}
          value={formatLogQuota(stats?.quota || 0)}
          description={t('Aggregated billing metadata for the selected range.')}
          icon={BarChart3}
        />
        <UsageStatCard
          title={t('Request Rate')}
          value={formatNumber(stats?.rpm || 0)}
          description={t('Peak requests per minute from usage metadata.')}
          icon={Gauge}
        />
        <UsageStatCard
          title={t('Token Rate')}
          value={formatNumber(stats?.tpm || 0)}
          description={t('Peak tokens per minute from usage metadata.')}
          icon={KeyRound}
        />
      </div>

      <Card className='gap-0 py-0'>
        <CardHeader className='border-b p-4 !pb-4 sm:p-5 sm:!pb-5'>
          <div className='flex items-start gap-3'>
            <span className='bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-flex size-9 shrink-0 items-center justify-center rounded-md'>
              <ShieldCheck className='size-4' />
            </span>
            <div>
              <h3 className='text-sm font-semibold'>
                {t('Privacy-first statistics')}
              </h3>
              <p className='text-muted-foreground mt-1 text-sm leading-6'>
                {t(
                  'Statistics are calculated from billing and routing metadata only. Request and response content are not stored.'
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5'>
          <p className='text-muted-foreground text-sm'>
            {t('Open usage logs for per-request metadata and error status.')}
          </p>
          <Button
            variant='outline'
            render={
              <Link
                to='/usage-logs/$section'
                params={{ section: 'common' }}
              />
            }
          >
            {t('Usage Logs')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function UsageStatisticsFiltersSkeleton() {
  return (
    <Card className='gap-0 py-0'>
      <CardContent className='space-y-3 p-4 sm:p-5'>
        <Skeleton className='h-5 w-36' />
        <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className={index === 0 ? 'h-8 sm:col-span-2' : 'h-8'}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
