"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getDailyWord, isValidWord } from "@/lib/wordle-words"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Award, BarChart3, Calendar, Share2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

type LetterStatus = "correct" | "present" | "absent" | "empty"

interface GuessLetter {
  letter: string
  status: LetterStatus
}

export default function WordlePage() {
  const [targetWord, setTargetWord] = useState("")
  const [guesses, setGuesses] = useState<GuessLetter[][]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({ played: 0, won: 0, streak: 0 })

  useEffect(() => {
    // Obtener palabra del día
    const word = getDailyWord()
    setTargetWord(word)

    // Cargar estadísticas y estado del juego desde localStorage
    const savedStats = localStorage.getItem("wordle-stats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }

    const today = new Date().toDateString()
    const savedGame = localStorage.getItem(`wordle-game-${today}`)
    if (savedGame) {
      const { guesses: savedGuesses, won: savedWon, gameOver: savedGameOver } = JSON.parse(savedGame)
      setGuesses(savedGuesses)
      setWon(savedWon)
      setGameOver(savedGameOver)
    }
  }, [])

  const evaluateGuess = (guess: string): GuessLetter[] => {
    const result: GuessLetter[] = []
    const targetLetters = targetWord.split("")
    const guessLetters = guess.split("")

    // Primero marcar las correctas
    const usedTargetIndices: boolean[] = Array(5).fill(false)
    const letterResults: LetterStatus[] = Array(5).fill("absent")

    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        letterResults[i] = "correct"
        usedTargetIndices[i] = true
      }
    })

    // Luego marcar las presentes
    guessLetters.forEach((letter, i) => {
      if (letterResults[i] === "correct") return

      const targetIndex = targetLetters.findIndex((l, idx) => l === letter && !usedTargetIndices[idx])
      if (targetIndex !== -1) {
        letterResults[i] = "present"
        usedTargetIndices[targetIndex] = true
      }
    })

    guessLetters.forEach((letter, i) => {
      result.push({ letter, status: letterResults[i] })
    })

    return result
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (currentGuess.length !== 5) {
      setError("La palabra debe tener 5 letras")
      return
    }

    if (!isValidWord(currentGuess)) {
      setError("Palabra no válida")
      return
    }

    const evaluatedGuess = evaluateGuess(currentGuess.toUpperCase())
    const newGuesses = [...guesses, evaluatedGuess]
    setGuesses(newGuesses)
    setCurrentGuess("")

    const isWinner = evaluatedGuess.every((l) => l.status === "correct")
    const isGameOver = isWinner || newGuesses.length >= 6

    if (isGameOver) {
      setGameOver(true)
      if (isWinner) {
        setWon(true)
        const newStats = {
          played: stats.played + 1,
          won: stats.won + 1,
          streak: stats.streak + 1,
        }
        setStats(newStats)
        localStorage.setItem("wordle-stats", JSON.stringify(newStats))
      } else {
        const newStats = {
          played: stats.played + 1,
          won: stats.won,
          streak: 0,
        }
        setStats(newStats)
        localStorage.setItem("wordle-stats", JSON.stringify(newStats))
      }

      // Guardar estado del juego
      const today = new Date().toDateString()
      localStorage.setItem(
        `wordle-game-${today}`,
        JSON.stringify({ guesses: newGuesses, won: isWinner, gameOver: true }),
      )
    }
  }

  const getLetterColor = (status: LetterStatus) => {
    switch (status) {
      case "correct":
        return "bg-green-500 text-white border-green-500"
      case "present":
        return "bg-yellow-500 text-white border-yellow-500"
      case "absent":
        return "bg-gray-400 text-white border-gray-400"
      default:
        return "bg-background border-border"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
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
            <CardTitle className="text-3xl font-serif text-center">Wordle en Español</CardTitle>
            <CardDescription className="text-center">
              Adivina la palabra de 5 letras en 6 intentos. Cada intento te dará pistas sobre las letras correctas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-center">
                  {Array.from({ length: 5 }).map((_, colIndex) => {
                    const guess = guesses[rowIndex]
                    const letter = guess?.[colIndex]
                    return (
                      <div
                        key={colIndex}
                        className={`w-14 h-14 border-2 rounded-md flex items-center justify-center text-2xl font-bold transition-all ${
                          letter ? getLetterColor(letter.status) : "bg-background border-border"
                        }`}
                      >
                        {letter?.letter || ""}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!gameOver ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value.toUpperCase().slice(0, 5))}
                  placeholder="Escribe tu palabra..."
                  className="text-center text-xl uppercase tracking-widest"
                  maxLength={5}
                  autoFocus
                />
                <Button type="submit" className="w-full" size="lg">
                  Enviar
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {won ? (
                  <Alert className="bg-green-500/10 border-green-500/50">
                    <Award className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      ¡Felicitaciones! Adivinaste la palabra en {guesses.length} intento{guesses.length > 1 ? "s" : ""}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-red-500/10 border-red-500/50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      La palabra era: <strong>{targetWord}</strong>
                    </AlertDescription>
                  </Alert>
                )}
                <Button className="w-full bg-transparent" variant="outline" onClick={() => window.location.reload()}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir resultado
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estadísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">{stats.played}</div>
                <div className="text-sm text-muted-foreground">Jugados</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Victoria</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.streak}</div>
                <div className="text-sm text-muted-foreground">Racha</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
