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

const ADJACENTS_COORDS: Record<string, Square> = {
  TOP_LEFT: [-1, -1],
  TOP_MID: [-1, 0],
  TOP_RIGHT: [-1, 1],
  MIDDLE_LEFT: [0, -1],
  MIDDLE_RIGHT: [0, 1],
  BOTTOM_LEFT: [1, -1],
  BOTTOM_MID: [1, 0],
  BOTTOM_RIGHT: [1, 1]
}

type Square = [number, number]

function phase1Solve (lines: string[]) {
  let partsNumbersList: number[] = []

  const {matrix, numbersSquaresList, symbolSquares} = useParser(lines)

  symbolSquares.forEach((symbol) => {
    const adjacents = getAdjacentSquares(symbol[0], matrix.length, (matrix[0] as []).length)

    const adjacentPartNumbers = numbersSquaresList.reduce((list, numberSquare) => {
      const [numberSquares, partNumber] = numberSquare

      const isAdjacent = numberSquares.some(sq => adjacents.some(adj => isSameSquare(sq, adj as Square)))

      if (isAdjacent) {
        list.push(Number(partNumber))
        numberSquare[0] = [] // track the found part number
      }
  
      return list
    }, [] as number[])

    partsNumbersList = [...partsNumbersList, ...adjacentPartNumbers]
  })

  return partsNumbersList.reduce((result, number) => result += number)
}

function phase2Solve (lines: string[]) {
  const gearsCoeficients: number[] = []

  const {matrix, numbersSquaresList, symbolSquares} = useParser(lines)

  symbolSquares.filter(symbol => symbol[1] === '*').forEach((symbol) => {
    const adjacents = getAdjacentSquares(symbol[0], matrix.length, (matrix[0] as []).length)

    const coefficients = adjacents.reduce((list, adj) => {
      const coef = numbersSquaresList.find(numberSquare => {
        const isAdjacent = numberSquare[0].some(sq => isSameSquare(sq, adj as Square))

        if (isAdjacent) {
          numberSquare[0] = [] // track the found part number
        }

        return isAdjacent
      })
  
      if (coef) {
        list.push(Number(coef[1]))
      }

      return list
    }, [] as number[])

    if (coefficients.length === 2) {
      const [c1, c2] = coefficients as [number, number]
      gearsCoeficients.push(c1 * c2)
    }
  })

  return gearsCoeficients.reduce((result, number) => result += number)
}

function useParser (lines: string[]) {
  const matrix: string[][] = []
  let _numberRead: string
  let _numberReadSquares: Square[]
  const symbolSquares: [Square, string][] = []
  const numbersSquaresList: [Square[], string][] = []

  function finishNumberRead () {
    if (_numberReadSquares?.length) {
      numbersSquaresList.push([_numberReadSquares, _numberRead])
    }
    _numberRead = ''
    _numberReadSquares = []
  }

  function registerNumberRead (character: string, [row, column]: [number, number]) {
    _numberRead = _numberRead + character
    _numberReadSquares.push([row, column])
  }

  function registerSymbolRead (character: string, [row, column]: [number, number]) {
    // console.log(character, `${row}, ${column}`)
    symbolSquares.push([[row, column], character])
  }

  lines.forEach((line, row) => {
    if (!Array.isArray(matrix[row])) {
      matrix[row] = [] // create the row
    }

    if (row === 0) {
      finishNumberRead()
    }
    
    line.split('').forEach((character, column) => {
      matrix[row]?.push(character)

      if (character === '.') {
        finishNumberRead()
      } else if (/[0-9]/.test(character)) {
        registerNumberRead(character, [row, column])
      } else {
        registerSymbolRead(character, [row, column])
        finishNumberRead()
      }
    })
  })

  return {
    matrix,
    symbolSquares,
    numbersSquaresList
  }
}

function getAdjacentSquares (square: Square, matrixRows: number, matrixCols: number): Square[] {
  const [y, x] = square

  return Object.values(ADJACENTS_COORDS)
    .map(coord => {
      return [y + coord[0], x + coord[1]]
    })
    .filter(coord => {
      const _cords = coord as Square
      const outOfBoundsY = _cords[0] < 0 || _cords[0] >= matrixRows
      const outOfBoundsX = _cords[1] < 0 || _cords[1] >= matrixCols
      return !outOfBoundsY && !outOfBoundsX
    }) as Square[]
}

function isSameSquare (square1: Square, square2: Square) {
  return square1[0] === square2[0] && square1[1] === square2[1]
}