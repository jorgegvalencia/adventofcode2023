import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Phase, getFileInput, toLines } from '../utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function solve (phase: Phase, input = 'input.txt') {
  const content = await getFileInput(__dirname, input)
  const lines = await toLines(content)

  const result = phase === 'one' ? phase1Solve(lines) : phase2Solve(lines)
  return result
}

function phase1Solve (lines: string[]) {
  const cardPoints = lines.map(line => {
    const [, numbers] = line.split(':')
    const [winningNumbersRaw, ownNumbersRaw] = (numbers as string).split('|')
    const winningNumbers = (winningNumbersRaw as string).trim().replaceAll('  ', ' ').split(' ')
    const ownNumbers = (ownNumbersRaw as string).trim().replaceAll('  ', ' ').split(' ')

    const cardMatches = ownNumbers.filter(own => winningNumbers.includes(own))

    return cardMatches.length > 1
      ? Math.pow(2, cardMatches.length - 1)
      : cardMatches.length
  })

  return cardPoints.reduce((result, cp) => result += cp)
}

function phase2Solve (lines: string[]) {
  const scratchCardsStacks = Array.from({ length: lines.length }, () => 1)

  let totalScratchCards = 0

  lines.forEach((line) => {
    const [card, numbers] = line.split(':')
    const parts = (card as string).trim().replaceAll('  ', ' ').split(' ')
    const cardNumber = parts[parts.length - 1]

    const [winningNumbersRaw, ownNumbersRaw] = (numbers as string).split('|')
    const winningNumbers = (winningNumbersRaw as string).trim().replaceAll('  ', ' ').split(' ')
    const ownNumbers = (ownNumbersRaw as string).trim().replaceAll('  ', ' ').split(' ')

    const cardMatches = ownNumbers.filter(own => winningNumbers.includes(own))
    while (scratchCardsStacks[(Number(cardNumber) -1)] as number > 0) {
      totalScratchCards++
      scratchCardsStacks[(Number(cardNumber) - 1)]--
      cardMatches.forEach((_, i) => scratchCardsStacks[Number(cardNumber) + i]++)
    }
  })

  return totalScratchCards
}