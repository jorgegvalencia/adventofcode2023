import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Phase, getFileInput, toLines } from '../utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

const NUMBERS = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9
} as const

export async function solve (phase: Phase, input = 'input.txt') {
  const content = await getFileInput(__dirname, input)
  const lines = await toLines(content)

  const result = phase === 'one' ? getCalibrationValuePhase1(lines) : getCalibrationValuePhase2(lines)
  return result
}

function getCalibrationValuePhase1 (lines: string[]) {
  function getCalibrationValue(line: string) {
    const first = getDigit(line) || ''
    const last = getDigit(line, true) || first
  
    return Number(first + last)
  }

  function getDigit (line: string, useReverse?: boolean) {
    const digit = useReverse
      ? line.split('').reverse().find(char => Boolean(Number(char)))
      : line.split('').find(char => Boolean(Number(char)))

    return digit
  }

  const calibrationValue = lines.reduce((calibration, line) => calibration += getCalibrationValue(line), 0)
  return calibrationValue.toString()
}

function getCalibrationValuePhase2 (lines: string[]) {
  function getCalibrationValue(line: string) {
    const first = getFirstDigit(line) || ''
    const last = getFirstDigit(line, true) || first
  
    return Number(first + last)
  }

  function getFirstDigit (line: string, useReverse?: boolean) {
    let digit, index = 0
    const buffer = []

    while (!digit && index < line.length) {
      const chain = useReverse
        ? [...line.split('')].reverse()
        : line.split('')

      const char = chain[index]

      if (Number(char)) {
        digit = char
      } else {
        buffer.push(char)

        const candidate = useReverse
          ? [...buffer].reverse().join('')
          : buffer.join('')

        const match = Object.keys(NUMBERS).find(number => candidate.includes(number))
        if (match) {
          digit = NUMBERS[match as keyof typeof NUMBERS]
        }
      }
      index++
    }
    return digit?.toString()
  }

  const calibrationValue = lines.reduce((calibration, line) => calibration += getCalibrationValue(line), 0)
  return calibrationValue.toString()
}