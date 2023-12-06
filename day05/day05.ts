import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Phase, getFileInput, toLines } from '../utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function solve (phase: Phase, input = 'input.txt') {
  const content = await getFileInput(__dirname, input)
  const lines = await toLines(content)

  const result = phase === 'one' ? phase1Solve(lines) : await phase2Solve(lines)
  return result
}

console.log = () => {}

function phase1Solve (lines: string[]) {
  let seeds: number[]
  const maps: Record<number, { source: string, destination: string, mappers: Array<(seed: number) => number> }> = {}
  let currentMapIndex: number

  lines.forEach((line, index) => {
    if (index === 0) {
      const [, seedsRaw] = line.split(':')
      seeds = (seedsRaw as string).trim().split(' ').map(seed => Number(seed))
    } else if (line === '') {
      const [source, destination] = ((lines[index + 1] as string).split(' ')[0] as string).split('-to-')

      currentMapIndex = index + 1
      maps[currentMapIndex] = { source: source as string, destination: destination as string, mappers: [] }
    } else if (index !== currentMapIndex) {
      const [destRangeStart, sourceRangeStart, range] = line.split(' ').map(el => Number(el))

      maps[currentMapIndex]?.mappers.push(
        createMapper(destRangeStart as number, sourceRangeStart as number, range as number)
      )
    }
  })

  // @ts-expect-error not initialized
  const locations = seeds.map(seed => {
    const stages = Object.keys(maps).length
    let pivot = seed

    for (let index = 0; index < stages; index++) {
      const mappers = Object.values(maps)
      console.log('=================================')
      console.log(mappers[index]?.source, mappers[index]?.destination)
      // @ts-expect-error not undefined
      pivot = mappers[index].mappers.reduce((currentPivot, mapper) => {
        const candidate = mapper(pivot)

        if (pivot !== currentPivot) {
          return currentPivot
        }
        if (candidate !== currentPivot) {
          currentPivot = candidate
        }
        return currentPivot
      }, pivot)

      console.log(`🔚 ${mappers[index]?.source, mappers[index]?.destination}. Output ${pivot}`)
    }
    return pivot
  })

  console.log(`Locations are ${locations.toString()}. Lowest is ${locations.sort((a, b) => a - b)[0]}`)

  return locations.sort((a, b) => a - b)[0]
}

async function phase2Solve (lines: string[]) {
  const seedsRange: [number, number][] = []
  const maps: Record<number, {
    source: string,
    destination: string,
    mappers: Array<(seed: number) => number>
  }> = {}
  let currentMapIndex: number

  lines.forEach((line, index) => {
    if (index === 0) {
      const [, seedsRaw] = line.split(':')
      const seeds = (seedsRaw as string).trim().split(' ').map(seed => Number(seed))

      for (let i = 0; i < seeds.length; i++) {
        if (i % 2 === 0) {
          const rangeStart = seeds[i] as number
          const rangeLength = seeds[i+1] as number
          seedsRange.push([rangeStart, rangeStart + rangeLength])
        }
      }
    } else if (line === '') {
      const [source, destination] = ((lines[index + 1] as string).split(' ')[0] as string).split('-to-')

      currentMapIndex = index + 1
      maps[currentMapIndex] = { source: source as string, destination: destination as string, mappers: [] }
    } else if (index !== currentMapIndex) {
      const [destRangeStart, sourceRangeStart, range] = line.split(' ').map(el => Number(el))

      maps[currentMapIndex]?.mappers.push(
        createMapper(destRangeStart as number, sourceRangeStart as number, range as number)
      )
    }
  })

  function getLocation(seed: number) {
    const stages = Object.keys(maps).length
    let pivot = seed

    for (let index = 0; index < stages; index++) {
      const stageMaps = Object.values(maps)
      console.log('=================================')
      console.log(stageMaps[index]?.source, stageMaps[index]?.destination)

      let currentPivot = pivot

      const stateMappers = stageMaps[index]?.mappers as Array<(seed: number) => number>
      for (let mapperIndex = 0; mapperIndex < stateMappers.length && pivot === currentPivot; mapperIndex++) {
        // @ts-expect-error not undefined
        const candidate = stateMappers[mapperIndex](pivot)
        if (pivot !== currentPivot) {
          break
        }
        if (candidate !== currentPivot) {
          currentPivot = candidate
        }
      }

      pivot = currentPivot

      console.log(`🔚 ${stageMaps[index]?.source, stageMaps[index]?.destination}. Output ${pivot}`)
    }

    return pivot
  }

  const locations = []
  for (const range of seedsRange) {
    for (let seed = range[0]; seed < range[1]; seed++) {
      const location = getLocation(seed)
      locations.push(location)
    }
  }

  console.log(`Locations are ${locations.toString()}. Lowest is ${locations.sort((a, b) => a - b)[0]}`)
  return (locations as number[]).sort((a, b) => a - b)[0]
}

function createMapper (destination: number, source: number, range: number) {
  const mapper = (seed: number) => {
    if (seed >= source && seed < source + range) {
      const posInInterval = (seed - source)

      console.log(`✅ Seed ${seed} is in position ${posInInterval} in the interval [${source}, ${source + range})`)

      const mappedValue = destination + posInInterval

      console.log(`Mapped value is ${mappedValue}`)

      return mappedValue
    }
    return seed
  }
  return mapper
}