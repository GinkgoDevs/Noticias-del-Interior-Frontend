// Generador de Sudoku con seed basado en fecha
export type SudokuGrid = number[][]

function seededRandom(seed: number): () => number {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function shuffle<T>(array: T[], random: () => number): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function isValid(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Verificar fila
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false
  }

  // Verificar columna
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false
  }

  // Verificar caja 3x3
  const startRow = row - (row % 3)
  const startCol = col - (col % 3)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false
    }
  }

  return true
}

function solveSudoku(grid: SudokuGrid, random: () => number): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], random)
        for (const num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num
            if (solveSudoku(grid, random)) {
              return true
            }
            grid[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

export function generateSudoku(difficulty: "easy" | "medium" | "hard" = "medium"): {
  puzzle: SudokuGrid
  solution: SudokuGrid
} {
  // Usar fecha como seed para generar el mismo puzzle cada día
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const seed = Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
  const random = seededRandom(seed)

  // Crear grid vacío
  const solution: SudokuGrid = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0))

  // Resolver para obtener una solución completa
  solveSudoku(solution, random)

  // Crear puzzle removiendo números según dificultad
  const puzzle: SudokuGrid = solution.map((row) => [...row])
  const cellsToRemove = difficulty === "easy" ? 30 : difficulty === "medium" ? 40 : 50

  let removed = 0
  while (removed < cellsToRemove) {
    const row = Math.floor(random() * 9)
    const col = Math.floor(random() * 9)
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0
      removed++
    }
  }

  return { puzzle, solution }
}

export function checkSudokuSolution(userGrid: SudokuGrid, solution: SudokuGrid): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (userGrid[i][j] !== solution[i][j]) {
        return false
      }
    }
  }
  return true
}
