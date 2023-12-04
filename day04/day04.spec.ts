import { describe, expect, test } from 'vitest'

import { solve } from './day04'

const outputs = {
  output1: 13,
  result1: 23441,
  output2: 30,
  result2: 5923918
}

describe('day4', () => {
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

    test('use case with input', async () => {
      expect(await solve('two', 'input.txt')).toBe(outputs.result2)
    })
  })
})

