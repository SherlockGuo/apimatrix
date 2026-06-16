import { LOG_TYPE_ALL_VALUE } from '../constants'
import { buildSearchParams } from './filter'
import { getDefaultTimeRange } from './utils'
import type { CommonLogFilters } from '../types'

export const USAGE_STATISTICS_DEFAULT_TYPE = LOG_TYPE_ALL_VALUE

export function getUsageStatisticsInitialFilters(
  searchParams: Record<string, unknown>
): CommonLogFilters {
  const { start, end } = getDefaultTimeRange()

  return {
    startTime:
      typeof searchParams.startTime === 'number'
        ? new Date(searchParams.startTime)
        : start,
    endTime:
      typeof searchParams.endTime === 'number'
        ? new Date(searchParams.endTime)
        : end,
    channel:
      typeof searchParams.channel === 'string' ? searchParams.channel : '',
    model: typeof searchParams.model === 'string' ? searchParams.model : '',
    token: typeof searchParams.token === 'string' ? searchParams.token : '',
    group: typeof searchParams.group === 'string' ? searchParams.group : '',
    username:
      typeof searchParams.username === 'string' ? searchParams.username : '',
  }
}

export function getUsageStatisticsInitialType(
  searchParams: Record<string, unknown>
): string {
  const value = searchParams.type
  if (Array.isArray(value) && value.length === 1 && typeof value[0] === 'string') {
    return value[0]
  }
  return USAGE_STATISTICS_DEFAULT_TYPE
}

export function buildUsageStatisticsSearch(filters: {
  filters: CommonLogFilters
  type: string
}): Record<string, unknown> {
  return {
    ...buildSearchParams(filters.filters, 'common'),
    type: [filters.type || USAGE_STATISTICS_DEFAULT_TYPE],
    page: 1,
  }
}
