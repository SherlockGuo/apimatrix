import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { getDashboardSectionNavItems } from './section-registry'

const identityT = ((key: string) => key) as Parameters<
  typeof getDashboardSectionNavItems
>[0]

describe('dashboard section navigation', () => {
  test('labels the model analytics section as the data dashboard', () => {
    const items = getDashboardSectionNavItems(identityT)
    const dataDashboardItem = items.find(
      (item) => item.url === '/dashboard/models'
    )

    assert.equal(dataDashboardItem?.title, 'Data Dashboard')
  })
})
