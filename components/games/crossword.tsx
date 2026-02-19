'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, AlertCircle, RotateCcw, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Word {
    id: string
    word: string
    clue: string
    row: number
    col: number
    direction: 'ACROSS' | 'DOWN'
}

interface CrosswordData {
    id: string
    date: string
    size: number
    solution: string[][]
    words: Word[]
}

export function Crossword() {
    const [data, setData] = useState<CrosswordData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userGrid, setUserGrid] = useState<string[][]>([])
    const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null)
    const [solved, setSolved] = useState(false)
    const [hints, setHints] = useState<number>(3)

    const cellsRef = useRef<(HTMLInputElement | null)[][]>([])

    useEffect(() => {
        fetchTodayCrossword()
    }, [])

    const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    const fetchTodayCrossword = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/games/crossword/today`)
            const json = await res.json()
            const crosswordData = json.data || (json.success ? json.data : json);

            if (crosswordData && crosswordData.size && crosswordData.solution) {
                // Normalize solution just in case
                crosswordData.solution = crosswordData.solution.map((row: string[]) =>
                    row.map(cell => normalize(cell))
                );
                // Also normalize words
                if (crosswordData.words) {
                    crosswordData.words = crosswordData.words.map((w: any) => ({
                        ...w,
                        word: normalize(w.word)
                    }));
                }

                setData(crosswordData)
                const emptyGrid = Array(crosswordData.size).fill('').map(() => Array(crosswordData.size).fill(''))
                setUserGrid(emptyGrid)
                cellsRef.current = Array(crosswordData.size).fill(null).map(() => Array(crosswordData.size).fill(null))
                setError(null)
            } else {
                setError(json.error || json.message || "No se pudo cargar el crucigrama de hoy")
            }
        } catch (err: any) {
            setError("Error de conexión con el servidor")
        } finally {
            setLoading(false)
        }
    }

    const handleCellChange = (r: number, c: number, val: string) => {
        if (solved) return
        let newVal = normalize(val);
        if (newVal.length > 1) {
            const oldVal = normalize(userGrid[r][c]);
            if (newVal.startsWith(oldVal)) newVal = newVal.slice(oldVal.length);
            else if (newVal.endsWith(oldVal)) newVal = newVal.slice(0, newVal.length - oldVal.length);
            else newVal = newVal.slice(-1);
        }
        if (newVal && !/^[A-ZÑ]$/.test(newVal)) return
        const newGrid = [...userGrid]
        newGrid[r][c] = newVal
        setUserGrid(newGrid)
        if (newVal !== '') focusNext(r, c)
        checkWin(newGrid)
    }

    const focusNext = (r: number, c: number) => {
        if (c + 1 < (data?.size || 0) && data?.solution[r][c + 1] !== '') {
            cellsRef.current[r][c + 1]?.focus()
        } else if (r + 1 < (data?.size || 0) && data?.solution[r + 1][c] !== '') {
            cellsRef.current[r + 1][c]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
        if (e.key === 'Backspace' && userGrid[r][c] === '') {
            if (c > 0 && data?.solution[r][c - 1] !== '') cellsRef.current[r][c - 1]?.focus()
            else if (r > 0 && data?.solution[r - 1][c] !== '') cellsRef.current[r - 1][c]?.focus()
        }
        const size = data?.size || 0
        if (e.key === 'ArrowRight') {
            let nextC = c + 1
            while (nextC < size && data?.solution[r][nextC] === '') nextC++
            if (nextC < size) cellsRef.current[r][nextC]?.focus()
        } else if (e.key === 'ArrowLeft') {
            let prevC = c - 1
            while (prevC >= 0 && data?.solution[r][prevC] === '') prevC--
            if (prevC >= 0) cellsRef.current[r][prevC]?.focus()
        } else if (e.key === 'ArrowDown') {
            let nextR = r + 1
            while (nextR < size && data?.solution[nextR][c] === '') nextR++
            if (nextR < size) cellsRef.current[nextR][c]?.focus()
        } else if (e.key === 'ArrowUp') {
            let prevR = r - 1
            while (prevR >= 0 && data?.solution[prevR][c] === '') prevR--
            if (prevR >= 0) cellsRef.current[prevR][c]?.focus()
        }
    }

    const checkWin = (grid: string[][]) => {
        if (!data) return
        for (let r = 0; r < data.size; r++) {
            for (let c = 0; c < data.size; c++) {
                if (data.solution[r][c] !== '' && normalize(grid[r][c]) !== normalize(data.solution[r][c])) return
            }
        }
        setSolved(true)
    }

    const isWordCorrect = (word: Word) => {
        if (!data || userGrid.length === 0) return false;
        for (let i = 0; i < word.word.length; i++) {
            const r = word.direction === 'ACROSS' ? word.row : word.row + i;
            const c = word.direction === 'ACROSS' ? word.col + i : word.col;
            if (normalize(userGrid[r][c]) !== normalize(data.solution[r][c])) return false;
        }
        return true;
    }

    const getHint = () => {
        if (hints <= 0 || solved || !data) return
        const pending = []
        for (let r = 0; r < data.size; r++) {
            for (let c = 0; c < data.size; c++) {
                if (data.solution[r][c] !== '' && normalize(userGrid[r][c]) !== normalize(data.solution[r][c])) pending.push({ r, c })
            }
        }
        if (pending.length > 0) {
            const lucky = pending[Math.floor(Math.random() * pending.length)]
            const newGrid = [...userGrid]
            newGrid[lucky.r][lucky.c] = data.solution[lucky.r][lucky.c]
            setUserGrid(newGrid)
            setHints(h => h - 1)
            checkWin(newGrid)
        }
    }

    const resetGame = () => {
        if (!data) return
        setUserGrid(Array(data.size).fill('').map(() => Array(data.size).fill('')))
        setSolved(false)
        setHints(3)
    }

    if (loading) return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 flex flex-col gap-6">
                <Card className="border-2 shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/20 dark:bg-muted/10 border-b flex flex-row items-center justify-between py-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-12" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8 flex justify-center">
                        <div className="grid grid-cols-12 gap-1 w-full max-w-[500px] aspect-square bg-border/50 p-1 rounded-lg">
                            {Array.from({ length: 144 }).map((_, i) => (
                                <Skeleton key={i} className="w-full h-full rounded-sm" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-5 space-y-6">
                <Card className="shadow-lg border-2">
                    <CardHeader className="py-3 border-b"><Skeleton className="h-6 w-32" /></CardHeader>
                    <CardContent className="p-4 space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
                    </CardContent>
                </Card>
                <Card className="shadow-lg border-2">
                    <CardHeader className="py-3 border-b"><Skeleton className="h-6 w-32" /></CardHeader>
                    <CardContent className="p-4 space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
                    </CardContent>
                </Card>
            </div>
        </div>
    )

    if (error) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-bold">Ups! Algo salió mal</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchTodayCrossword} variant="outline" className="mt-4">Reintentar</Button>
        </div>
    )

    if (!data) return null

    const acrossClues = data.words.filter(w => w.direction === 'ACROSS')
    const downClues = data.words.filter(w => w.direction === 'DOWN')

    const activeWord = selectedCell ? data.words.find(w => {
        if (w.direction === 'ACROSS') {
            return w.row === selectedCell.r && selectedCell.c >= w.col && selectedCell.c < w.col + w.word.length;
        } else {
            return w.col === selectedCell.c && selectedCell.r >= w.row && selectedCell.r < w.row + w.word.length;
        }
    }) : null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-7 flex flex-col gap-4">
                {/* Active Clue Bar */}
                <div className="bg-primary/5 border-2 border-primary/10 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {/* logic for prev word */ }}>
                        <span className="sr-only">Anterior</span>
                        <HelpCircle className="h-4 w-4 rotate-180" />
                    </Button>
                    <div className="text-center px-4">
                        {activeWord ? (
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                    {activeWord.direction === 'ACROSS' ? 'Horizontal' : 'Vertical'} {data.words.indexOf(activeWord) + 1}
                                </span>
                                <p className="text-sm md:text-base font-medium text-foreground line-clamp-2">
                                    {activeWord.clue}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic font-serif">
                                Selecciona una casilla para ver la pista...
                            </p>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {/* logic for next word */ }}>
                        <span className="sr-only">Siguiente</span>
                        <HelpCircle className="h-4 w-4" />
                    </Button>
                </div>

                <Card className="border-2 shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/20 dark:bg-muted/10 border-b flex flex-row items-center justify-between py-4">
                        <div>
                            <CardTitle className="text-xl font-serif">Grilla del Día</CardTitle>
                            <CardDescription>Tamaño {data.size}x{data.size}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={resetGame} title="Reiniciar">
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={getHint} disabled={hints <= 0 || solved} className="gap-2">
                                <HelpCircle className="h-4 w-4" />
                                Pistas: {hints}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8 flex justify-center">
                        <div
                            className="grid gap-1 bg-border/50 p-1 rounded-lg shadow-inner"
                            style={{
                                gridTemplateColumns: `repeat(${data.size}, minmax(0, 1fr))`,
                                width: '100%',
                                maxWidth: '500px',
                                aspectRatio: '1/1'
                            }}
                        >
                            {Array(data.size).fill(0).map((_, r) => (
                                Array(data.size).fill(0).map((_, c) => {
                                    const isBlack = data.solution[r][c] === ''
                                    const wordStart = data.words.find(w => w.row === r && w.col === c)
                                    return (
                                        <div
                                            key={`${r}-${c}`}
                                            className={cn(
                                                "relative flex items-center justify-center rounded-sm transition-all duration-200",
                                                isBlack ? "bg-slate-900 dark:bg-black" : "bg-background",
                                                selectedCell?.r === r && selectedCell?.c === c && !isBlack ? "ring-2 ring-primary z-10 scale-105" : ""
                                            )}
                                        >
                                            {!isBlack && (
                                                <>
                                                    {wordStart && (
                                                        <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] font-bold text-muted-foreground/60 leading-none">
                                                            {data.words.indexOf(wordStart) + 1}
                                                        </span>
                                                    )}
                                                    <input
                                                        ref={el => { cellsRef.current[r][c] = el }}
                                                        type="text"
                                                        value={userGrid[r][c]}
                                                        onChange={(e) => handleCellChange(r, c, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, r, c)}
                                                        onFocus={(e) => {
                                                            setSelectedCell({ r, c });
                                                            e.target.select();
                                                        }}
                                                        className={cn(
                                                            "w-full h-full text-center bg-transparent border-none outline-none font-bold text-lg sm:text-xl uppercase",
                                                            solved ? "text-green-600 dark:text-green-400" : "text-foreground"
                                                        )}
                                                        disabled={solved}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )
                                })
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {solved && (
                    <Card className="bg-green-500/10 border-green-500/50 animate-in fade-in zoom-in duration-500">
                        <CardContent className="py-6 flex flex-col items-center gap-3 text-center">
                            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">¡Excelente trabajo!</h3>
                            <p className="text-green-700 dark:text-green-300">Has completado el crucigrama de hoy con éxito.</p>
                            <Button className="mt-2 bg-green-600 hover:bg-green-700" onClick={() => window.location.href = '/juegos'}>
                                Ver más juegos
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="xl:col-span-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 h-full">
                <Card className="shadow-lg border-2 flex flex-col h-full ring-primary/5 hover:ring-primary/20 transition-all">
                    <CardHeader className="bg-blue-500/5 dark:bg-blue-500/10 py-3 border-b">
                        <CardTitle className="text-md flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Horizontales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden">
                        <div className="h-[300px] md:h-[500px] xl:h-[600px] overflow-y-auto divide-y divide-border/50 scrollbar-thin scrollbar-thumb-muted">
                            {acrossClues.map((w, idx) => (
                                <div
                                    key={w.id}
                                    className={cn(
                                        "p-3 text-sm transition-all cursor-pointer hover:bg-accent relative group",
                                        activeWord?.id === w.id ? "bg-blue-500/15 border-l-4 border-blue-500" : "border-l-4 border-transparent"
                                    )}
                                    onClick={() => cellsRef.current[w.row][w.col]?.focus()}
                                >
                                    <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">{data.words.indexOf(w) + 1}</span>
                                    <span className={cn(
                                        "text-foreground/80 leading-snug",
                                        isWordCorrect(w) ? "line-through opacity-40 italic" : ""
                                    )}>{w.clue}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-2 flex flex-col h-full ring-primary/5 hover:ring-primary/20 transition-all">
                    <CardHeader className="bg-purple-500/5 dark:bg-purple-500/10 py-3 border-b">
                        <CardTitle className="text-md flex items-center gap-2 text-purple-700 dark:text-purple-400">
                            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                            Verticales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden">
                        <div className="h-[300px] md:h-[500px] xl:h-[600px] overflow-y-auto divide-y divide-border/50 scrollbar-thin scrollbar-thumb-muted">
                            {downClues.map((w, idx) => (
                                <div
                                    key={w.id}
                                    className={cn(
                                        "p-3 text-sm transition-all cursor-pointer hover:bg-accent relative group",
                                        activeWord?.id === w.id ? "bg-purple-500/15 border-l-4 border-purple-500" : "border-l-4 border-transparent"
                                    )}
                                    onClick={() => cellsRef.current[w.row][w.col]?.focus()}
                                >
                                    <span className="font-bold text-purple-600 dark:text-purple-400 mr-2">{data.words.indexOf(w) + 1}</span>
                                    <span className={cn(
                                        "text-foreground/80 leading-snug",
                                        isWordCorrect(w) ? "line-through opacity-40 italic" : ""
                                    )}>{w.clue}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
