"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { generateSudoku, checkSudokuSolution, type SudokuGrid } from "@/lib/sudoku-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Calendar, RotateCcw, Lightbulb } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Difficulty = "easy" | "medium" | "hard"

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [puzzle, setPuzzle] = useState<SudokuGrid>([])
  const [solution, setSolution] = useState<SudokuGrid>([])
  const [userGrid, setUserGrid] = useState<SudokuGrid>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [gameWon, setGameWon] = useState(false)
  const [errors, setErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadGame()
  }, [])

  const loadGame = () => {
    const today = new Date().toDateString()
    const savedGame = localStorage.getItem(`sudoku-game-${today}`)

    if (savedGame) {
      const {
        puzzle: savedPuzzle,
        solution: savedSolution,
        userGrid: savedUserGrid,
        difficulty: savedDifficulty,
        won,
      } = JSON.parse(savedGame)
      setPuzzle(savedPuzzle)
      setSolution(savedSolution)
      setUserGrid(savedUserGrid)
      setDifficulty(savedDifficulty)
      setGameWon(won || false)
    } else {
      startNewGame("medium")
    }
  }

  const startNewGame = (diff: Difficulty) => {
    const { puzzle: newPuzzle, solution: newSolution } = generateSudoku(diff)
    setPuzzle(newPuzzle)
    setSolution(newSolution)
    setUserGrid(newPuzzle.map((row) => [...row]))
    setDifficulty(diff)
    setGameWon(false)
    setErrors(new Set())
    setSelectedCell(null)

    // Guardar juego nuevo
    const today = new Date().toDateString()
    localStorage.setItem(
      `sudoku-game-${today}`,
      JSON.stringify({
        puzzle: newPuzzle,
        solution: newSolution,
        userGrid: newPuzzle,
        difficulty: diff,
        won: false,
      }),
    )
  }

  const handleCellClick = (row: number, col: number) => {
    if (puzzle[row][col] === 0) {
      setSelectedCell({ row, col })
    }
  }

  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameWon) return

    const { row, col } = selectedCell
    if (puzzle[row][col] !== 0) return

    const newGrid = userGrid.map((r) => [...r])
    newGrid[row][col] = num

    setUserGrid(newGrid)

    // Verificar si el número es correcto
    if (num !== 0 && num !== solution[row][col]) {
      const errorKey = `${row}-${col}`
      setErrors((prev) => new Set(prev).add(errorKey))
    } else {
      const errorKey = `${row}-${col}`
      setErrors((prev) => {
        const newErrors = new Set(prev)
        newErrors.delete(errorKey)
        return newErrors
      })
    }

    // Verificar si ganó
    const isComplete = newGrid.every((row) => row.every((cell) => cell !== 0))
    if (isComplete && checkSudokuSolution(newGrid, solution)) {
      setGameWon(true)
      const today = new Date().toDateString()
      localStorage.setItem(
        `sudoku-game-${today}`,
        JSON.stringify({
          puzzle,
          solution,
          userGrid: newGrid,
          difficulty,
          won: true,
        }),
      )
    } else {
      // Guardar progreso
      const today = new Date().toDateString()
      localStorage.setItem(
        `sudoku-game-${today}`,
        JSON.stringify({
          puzzle,
          solution,
          userGrid: newGrid,
          difficulty,
          won: false,
        }),
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!selectedCell) return

    const num = Number.parseInt(e.key)
    if (num >= 1 && num <= 9) {
      handleNumberInput(num)
    } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
      handleNumberInput(0)
    }
  }

  const getCellColor = (row: number, col: number) => {
    const errorKey = `${row}-${col}`
    if (errors.has(errorKey)) return "bg-red-100 dark:bg-red-900/30 border-red-500"
    if (selectedCell?.row === row && selectedCell?.col === col) return "bg-blue-100 dark:bg-blue-900/30 border-blue-500"
    if (selectedCell?.row === row || selectedCell?.col === col) return "bg-blue-50 dark:bg-blue-900/10"
    if (Math.floor(row / 3) % 2 === Math.floor(col / 3) % 2) return "bg-muted/30"
    return "bg-background"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/juegos" className="text-sm text-muted-foreground hover:text-foreground">
            ← Volver a juegos
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Hoy</span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-center">Sudoku Diario</CardTitle>
            <CardDescription className="text-center">
              Completa la cuadrícula de 9x9 con números del 1 al 9 sin repetir en filas, columnas o cajas 3x3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex justify-center">
              <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <TabsList>
                  <TabsTrigger value="easy">Fácil</TabsTrigger>
                  <TabsTrigger value="medium">Medio</TabsTrigger>
                  <TabsTrigger value="hard">Difícil</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {gameWon && (
              <Alert className="bg-green-500/10 border-green-500/50 mb-6">
                <Award className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  ¡Felicitaciones! Completaste el Sudoku correctamente
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center mb-6" onKeyDown={handleKeyPress} tabIndex={0}>
              <div className="inline-block border-4 border-border rounded-lg overflow-hidden">
                {userGrid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                      <button
                        key={colIndex}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`w-12 h-12 border border-border flex items-center justify-center text-lg font-semibold transition-colors ${getCellColor(
                          rowIndex,
                          colIndex,
                        )} ${puzzle[rowIndex][colIndex] !== 0 ? "text-foreground font-bold" : "text-primary cursor-pointer hover:bg-accent"} ${
                          colIndex % 3 === 2 && colIndex !== 8 ? "border-r-2 border-r-border" : ""
                        } ${rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-2 border-b-border" : ""}`}
                        disabled={puzzle[rowIndex][colIndex] !== 0 || gameWon}
                      >
                        {cell !== 0 ? cell : ""}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {!gameWon && (
              <>
                <div className="grid grid-cols-9 gap-2 mb-4 max-w-md mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleNumberInput(num)}
                      variant="outline"
                      size="lg"
                      className="text-lg font-bold"
                      disabled={!selectedCell}
                    >
                      {num}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleNumberInput(0)}
                    variant="outline"
                    className="flex-1"
                    disabled={!selectedCell}
                  >
                    Borrar
                  </Button>
                  <Button onClick={() => startNewGame(difficulty)} variant="outline" className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              </>
            )}

            {gameWon && (
              <Button onClick={() => startNewGame(difficulty)} className="w-full" size="lg">
                Jugar con otra dificultad
              </Button>
            )}
          </CardContent>
        </Card>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Consejo:</strong> Usa el teclado para ingresar números (1-9) y la tecla Suprimir para borrar. Haz
            clic en una celda vacía para seleccionarla.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
