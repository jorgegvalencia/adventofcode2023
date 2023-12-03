import { describe, expect, test } from 'vitest'

import { solve } from './day03'

const outputs = {
  output1: 4361,
  result1: 539433,
  output2: 467835,
  result2: 75847567
}

describe('day3', () => {
  describe('phase 1', () => {
    test('use case with sample', async () => {
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

    test('use case with input', async () => {
      expect(await solve('two', 'input.txt')).toBe(outputs.result2)
    })
  })
})
