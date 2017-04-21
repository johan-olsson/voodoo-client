'use strict'

const merge = require('../lib/merge')
const assert = require('assert')

describe('merge', () => {

  it('should merge and clone all given objects', () => {

    const first = {
      foo: 'bar'
    }

    const merged = merge(first, {
      foo: 'foo'
    }, {
      fest: 'test'
    })

    assert.equal(merged.foo, 'foo')
    assert.equal(merged.fest, 'test')
    assert.equal(first.foo, 'bar')
  })
})
