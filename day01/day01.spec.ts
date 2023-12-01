import { describe, expect, test } from 'vitest'

import { solve } from './day01'

const outputs = {
  output1: '142',
  result1: '55208',
  output2: '281',
  result2: '54578'
}

describe('day1', () => {
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
      expect(await solve('two', 'sample2.txt')).toBe(outputs.output2)
    })

    test('use case with input', async () => {
      expect(await solve('two', 'input.txt')).toBe(outputs.result2)
    })
  })
})
