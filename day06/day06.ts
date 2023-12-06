import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Phase, getFileInput, toLines } from '../utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

const moment = 1 // 1mm per milisecond

console.log = () => {}

export async function solve (phase: Phase, input = 'input.txt') {
  const content = await getFileInput(__dirname, input)
  const lines = await toLines(content)

  const result = phase === 'one' ? phase1Solve(lines) : phase2Solve(lines)
  return result
}

function phase1Solve (lines: string[]) {
  const races = parseInput(lines)

  const recordsPerRace = races.map((race: { time: number, distance: number }) => {
    const { time, distance } = race

    const possibleRecords = []
    for (let leaveHoldTime = time; leaveHoldTime > 0; leaveHoldTime--) {
      console.log(`
        If we hold ${leaveHoldTime} milliseconds
        we reach ${leaveHoldTime*moment} mm/ms
        for a remaining of ${time - leaveHoldTime} ms
        and a remaining distance of ${distance} mm
      `.split('\n').filter(s => Boolean(s)).join('\n'))

      if (leaveHoldTime * moment * (time - leaveHoldTime) > distance) {
        possibleRecords.push(leaveHoldTime)
        console.log(`
          ✅ We reach the race distance ${distance} mm
          as we made ${leaveHoldTime*moment*(time - leaveHoldTime)} mm
        `.split('\n').filter(s => Boolean(s)).join('\n'))
      } else {
        console.log(`
          ❌ We cannot reach the race distance ${distance} mm
          as we made ${leaveHoldTime*moment*(time - leaveHoldTime)} mm
        `.split('\n').filter(s => Boolean(s)).join('\n'))
      }
    }

    console.log(possibleRecords)
    return possibleRecords
  })

  return recordsPerRace.reduce((cases, raceRecords) => cases = cases * raceRecords.length, 1)
}

function phase2Solve (lines: string[]) {
  const race = parseInput2(lines)

  const { time, distance } = race

  let possibleRecords = 0
  for (let leaveHoldTime = time; leaveHoldTime > 0; leaveHoldTime--) {
    console.log(`
      If we hold ${leaveHoldTime} milliseconds
      we reach ${leaveHoldTime*moment} mm/ms
      for a remaining of ${time - leaveHoldTime} ms
      and a remaining distance of ${distance} mm
    `.split('\n').filter(s => Boolean(s)).join('\n'))

    if (leaveHoldTime * moment * (time - leaveHoldTime) > distance) {
      possibleRecords++
      console.log(`
        ✅ We reach the race distance ${distance} mm
        as we made ${leaveHoldTime*moment*(time - leaveHoldTime)} mm
      `.split('\n').filter(s => Boolean(s)).join('\n'))
    } else {
      console.log(`
        ❌ We cannot reach the race distance ${distance} mm
        as we made ${leaveHoldTime*moment*(time - leaveHoldTime)} mm
      `.split('\n').filter(s => Boolean(s)).join('\n'))
    }
  }

  return possibleRecords
}

function parseInput (lines: string[]){
  const [, timesRaw] = (lines[0] as string).split(':') as string[]
  const [, distancesRaw] = (lines[1] as string).split(':') as string[]

  const times = timesRaw?.split(' ').map(s => s.trim()).filter(s => s)
  const distances = distancesRaw?.split(' ').map(s => s.trim()).filter(s => s)

  return (times as string[]).map((t, i) => ({ time: Number(t), distance: Number((distances as string[])[i]) }))
}

function parseInput2 (lines: string[]){
  const [, timesRaw] = (lines[0] as string).split(':') as string[]
  const [, distancesRaw] = (lines[1] as string).split(':') as string[]

  const time = timesRaw?.split(' ').map(s => s.trim()).filter(s => s).join('')
  const distance = distancesRaw?.split(' ').map(s => s.trim()).filter(s => s).join('')

  return { time: Number(time), distance: Number(distance) }
}

solve('two', 'sample.txt')