import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Phase, getFileInput, toLines } from '../utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

const gamesetup = {
  red: 12,
  green: 13,
  blue: 14
} as const

type Color = keyof typeof gamesetup

type GameSetup = Record<Color, number>

export async function solve (phase: Phase, input = 'input.txt') {
  const content = await getFileInput(__dirname, input)
  const lines = await toLines(content)

  const result = phase === 'one' ? phase1Solve(lines) : phase2Solve(lines)
  return result
}

function phase1Solve (lines: string[], setup: GameSetup = gamesetup) {
  let result = 0
  for (const line of lines) {
    const idvalue = getGameValue(line, setup)
    result += idvalue
  }

  function getGameValue (line: string, setup: GameSetup) {
    const [game, showcases]: string[] = line.split(': ')
    const [, id] = (game as string).split(' ')

    const max: Partial<GameSetup> = {}

    let isValidSetup = true, index = 0
    const parsedShowcases = (showcases as string).split('; ')

    while(index < parsedShowcases.length && isValidSetup) {
      const showcase = parsedShowcases[index]

      for (const scase of (showcase as string).split(', ')) {
        const [cubes, color] = scase.split(' ') as [cubes: string, color: Color]
  
        if (!max[color]) {
          max[color] = Number(cubes)
        } else {
          max[color] = Math.max(max[color] as number, Number(cubes))
        }
      }

      for(const color in setup) {
        if (max[color as Color]! > setup[color as Color]) {
          isValidSetup = false
          break
        }
      }

      index++
    }
    return isValidSetup ? Number(id) : 0
  }

  return result.toString()
}

function phase2Solve (lines: string[]) {
  let result = 0
  for (const line of lines) {
    const idvalue = getGameValue(line)
    result += idvalue
  }

  function getGameValue (line: string) {
    const [, showcases]: string[] = line.split(': ')

    const max: Partial<GameSetup> = {}

    let index = 0
    const parsedShowcases = (showcases as string).split('; ')

    while(index < parsedShowcases.length) {
      const showcase = parsedShowcases[index]

      for (const scase of (showcase as string).split(', ')) {
        const [cubes, color] = scase.split(' ') as [cubes: string, color: Color]
  
        if (!max[color]) {
          max[color] = Number(cubes)
        } else {
          max[color] = Math.max(max[color] as number, Number(cubes))
        }
      }

      index++
    }
  
    return Object.values(max).reduce((result, colorCubes) => result = result * colorCubes)
  }

  return result.toString()
}