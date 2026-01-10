export const dynamic = "force-dynamic"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Grid3x3, Trophy, Calendar } from "lucide-react"

const games = [
  {
    title: "Wordle",
    description: "Adivina la palabra de 5 letras en 6 intentos",
    icon: Brain,
    href: "/juegos/wordle",
    difficulty: "Fácil",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Sudoku",
    description: "Completa la cuadrícula de 9x9 con números del 1 al 9",
    icon: Grid3x3,
    href: "/juegos/sudoku",
    difficulty: "Medio",
    color: "from-blue-500/20 to-cyan-500/20",
  },
]

export default function JuegosPage() {
  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">{today}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Juegos Diarios</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desafía tu mente con nuestros juegos que se actualizan automáticamente cada día
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {games.map((game) => {
              const Icon = game.icon
              return (
                <Link key={game.href} href={game.href}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full">
                    <CardHeader>
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="h-8 w-8 text-foreground" />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-2xl">{game.title}</CardTitle>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted">{game.difficulty}</span>
                      </div>
                      <CardDescription className="text-base">{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        Jugar ahora
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-primary" />
                <CardTitle>Tus Estadísticas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Completa los juegos para ver tus estadísticas y rachas de victorias
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
