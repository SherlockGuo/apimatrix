import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import {
  buildUsageStatisticsSearch,
  getUsageStatisticsInitialFilters,
  getUsageStatisticsInitialType,
} from './usage-statistics-filter'

describe('usage statistics filters', () => {
  test('hydrates filter state from route search params', () => {
    const startTime = Date.UTC(2026, 0, 1, 0, 0, 0)
    const endTime = Date.UTC(2026, 0, 2, 0, 0, 0)

    const filters = getUsageStatisticsInitialFilters({
      startTime,
      endTime,
      model: 'qwen3-32b',
      token: 'prod-key',
      group: 'default',
      username: 'alice',
      channel: '24',
      type: ['2'],
    })

    assert.equal(filters.startTime?.getTime(), startTime)
    assert.equal(filters.endTime?.getTime(), endTime)
    assert.equal(filters.model, 'qwen3-32b')
    assert.equal(filters.token, 'prod-key')
    assert.equal(filters.group, 'default')
    assert.equal(filters.username, 'alice')
    assert.equal(filters.channel, '24')
    assert.equal(
      getUsageStatisticsInitialType({ type: ['2'] }),
      '2'
    )
  })

  test('builds route search params for the statistics API query', () => {
    const start = new Date(Date.UTC(2026, 0, 1, 0, 0, 0))
    const end = new Date(Date.UTC(2026, 0, 2, 0, 0, 0))

    assert.deepEqual(
      buildUsageStatisticsSearch({
        filters: {
          startTime: start,
          endTime: end,
          model: 'qwen3-32b',
          token: 'prod-key',
          group: 'default',
          username: 'alice',
          channel: '24',
        },
        type: '2',
      }),
      {
        startTime: start.getTime(),
        endTime: end.getTime(),
        model: 'qwen3-32b',
        token: 'prod-key',
        group: 'default',
        username: 'alice',
        channel: '24',
        type: ['2'],
        page: 1,
      }
    )
  })
})
