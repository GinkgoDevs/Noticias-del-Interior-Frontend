"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { generateSudoku, checkSudokuSolution, type SudokuGrid } from "@/lib/sudoku-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Calendar, RotateCcw, Lightbulb } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type Difficulty = "easy" | "medium" | "hard"

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [puzzle, setPuzzle] = useState<SudokuGrid>([])
  const [solution, setSolution] = useState<SudokuGrid>([])
  const [userGrid, setUserGrid] = useState<SudokuGrid>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [gameWon, setGameWon] = useState(false)
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGame()
  }, [])

  const loadGame = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/games/sudoku/today`)
      const json = await res.json()

      if (json.success && json.data) {
        const { puzzle: dailyPuzzle, solution: dailySolution } = json.data

        const today = new Date().toDateString()
        const savedGame = localStorage.getItem(`sudoku-game-${today}`)

        if (savedGame) {
          const { userGrid: savedUserGrid, won } = JSON.parse(savedGame)
          setPuzzle(dailyPuzzle)
          setSolution(dailySolution)
          setUserGrid(savedUserGrid)
          setDifficulty(json.data.difficulty || "medium")
          setGameWon(won || false)
        } else {
          setPuzzle(dailyPuzzle)
          setSolution(dailySolution)
          setUserGrid(dailyPuzzle.map((row: number[]) => [...row]))
          setDifficulty(json.data.difficulty || "medium")
          setGameWon(false)
        }
      }
    } catch (error) {
      console.error("Error loading daily sudoku:", error)
    } finally {
      setLoading(false)
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

    const isComplete = newGrid.every((row) => row.every((cell) => cell !== 0))
    if (isComplete && checkSudokuSolution(newGrid, solution)) {
      setGameWon(true)
      const today = new Date().toDateString()
      localStorage.setItem(`sudoku-game-${today}`, JSON.stringify({ puzzle, solution, userGrid: newGrid, difficulty, won: true }))
    } else {
      const today = new Date().toDateString()
      localStorage.setItem(`sudoku-game-${today}`, JSON.stringify({ puzzle, solution, userGrid: newGrid, difficulty, won: false }))
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
    if (errors.has(errorKey)) return "bg-red-100 dark:bg-red-950/50 border-red-500"
    if (selectedCell?.row === row && selectedCell?.col === col) return "bg-primary/20 dark:bg-primary/30 border-primary"
    if (selectedCell?.row === row || selectedCell?.col === col) return "bg-primary/5 dark:bg-primary/10"
    if (Math.floor(row / 3) % 2 === Math.floor(col / 3) % 2) return "bg-muted/50 dark:bg-muted/20"
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
            {loading ? (
              <div className="space-y-6">
                <div className="mb-6 flex justify-center">
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="grid grid-cols-9 gap-0 border-2 border-border/80">
                    {Array.from({ length: 9 }).map((_, r) => (
                      Array.from({ length: 9 }).map((_, c) => (
                        <Skeleton
                          key={`${r}-${c}`}
                          className={`w-10 h-10 sm:w-12 sm:h-12 border border-border/40 rounded-none ${c % 3 === 2 && c !== 8 ? "border-r-2" : ""
                            } ${r % 3 === 2 && r !== 8 ? "border-b-2" : ""}`}
                        />
                      ))
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-9 gap-2 mb-4 max-w-md mx-auto">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium">
                    Dificultad: <span className="capitalize text-primary">{difficulty}</span>
                  </div>
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
                  <div className="inline-block border-2 border-border/80 dark:border-border rounded-lg overflow-hidden shadow-lg">
                    {userGrid.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex">
                        {row.map((cell, colIndex) => (
                          <button
                            key={colIndex}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 border border-border/40 flex items-center justify-center text-lg font-semibold transition-colors ${getCellColor(
                              rowIndex,
                              colIndex,
                            )} ${puzzle[rowIndex][colIndex] !== 0 ? "text-foreground font-bold" : "text-primary cursor-pointer hover:bg-accent"} ${colIndex % 3 === 2 && colIndex !== 8 ? "border-r-2 border-r-border/80 dark:border-r-border" : ""
                              } ${rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-2 border-b-border/80 dark:border-b-border" : ""}`}
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
                        <Button key={num} onClick={() => handleNumberInput(num)} variant="outline" size="lg" className="text-lg font-bold" disabled={!selectedCell}>
                          {num}
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleNumberInput(0)} variant="outline" className="flex-1" disabled={!selectedCell}>
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
                  <Button onClick={() => window.location.reload()} className="w-full" size="lg">
                    ¡Volver mañana para más!
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Consejo:</strong> Usa el teclado para ingresar números (1-9) y la tecla Suprimir para borrar. Haz clic en una celda vacía para seleccionarla.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
