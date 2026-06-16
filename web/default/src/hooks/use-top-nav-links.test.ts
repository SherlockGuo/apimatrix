import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { isExternalDocsLink } from './use-top-nav-links'

describe('isExternalDocsLink', () => {
  test('treats local documentation routes as internal links', () => {
    assert.equal(isExternalDocsLink('/docs'), false)
    assert.equal(isExternalDocsLink('/docs/getting-started'), false)
  })

  test('treats absolute documentation URLs as external links', () => {
    assert.equal(isExternalDocsLink('https://apihelp.botsmart.net/'), true)
    assert.equal(isExternalDocsLink('http://example.com/docs'), true)
  })
})
