import { describe, expect, test } from 'vitest'

import { solve } from './day06'
const outputs = {
  output1: 288,
  result1: 2374848,
  output2: 71503,
  result2: 39132886
}

describe('day6', () => {
  describe('phase 1', () => {
    test('use case with sample', async () => {
      expect(true).toBe(true)
      expect(await solve('one', 'sample.txt')).toBe(outputs.output1)
    })

    test('use case with input', async () => {
      expect(await solve('one', 'input.txt')).toBe(outputs.result1)
    })
  })

  describe('phase 2', () => {
    test('use case with sample 2', async () => {
      expect(await solve('two', 'sample.txt')).toBe(outputs.output2)
    })

    test.skip('use case with input', async () => {
      expect(await solve('two', 'input.txt')).toBe(outputs.result2)
    })
  })
})

