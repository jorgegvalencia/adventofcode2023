import { describe, expect, test } from 'vitest'

import { solve } from './day02'

const outputs = {
  output1: '8',
  result1: '2156',
  output2: '2286',
  result2: '66909'
}

describe('day2', () => {
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
