import Link from "next/link"
import { Gamepad2 } from "lucide-react"

export function GamesSection() {
  const games = [
    {
      name: "Wordle",
      difficulty: "Básico",
      icon: "wordle",
      href: "/juegos/wordle",
      description: "Adivina la palabra del día",
    },
    {
      name: "Sudoku",
      difficulty: "Intermedio",
      icon: "sudoku",
      href: "/juegos/sudoku",
      description: "Puzzle de números clásico",
    },
  ]

  return (
    <section className="border-t-2 border-border pt-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/juegos"
          className="font-serif text-2xl md:text-3xl font-bold tracking-tight hover:text-primary transition-colors flex items-center gap-2 group"
        >
          Juguemos
          <span className="text-xl group-hover:translate-x-1 transition-transform">›</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {games.map((game, index) => (
          <Link
            key={index}
            href={game.href}
            className="group flex flex-col items-center text-center p-4 md:p-6 border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all bg-card"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4 flex items-center justify-center rounded-lg bg-accent/50 group-hover:bg-accent transition-colors">
              {game.icon === "wordle" && (
                <div className="grid grid-cols-5 gap-0.5 w-10 h-10 md:w-12 md:h-12">
                  <div className="bg-green-500 rounded-sm"></div>
                  <div className="bg-yellow-500 rounded-sm"></div>
                  <div className="bg-muted rounded-sm"></div>
                  <div className="bg-green-500 rounded-sm"></div>
                  <div className="bg-muted rounded-sm"></div>
                  <div className="bg-muted rounded-sm"></div>
                  <div className="bg-green-500 rounded-sm"></div>
                  <div className="bg-yellow-500 rounded-sm"></div>
                  <div className="bg-muted rounded-sm"></div>
                  <div className="bg-green-500 rounded-sm"></div>
                </div>
              )}
              {game.icon === "sudoku" && (
                <div className="grid grid-cols-3 gap-0.5 w-10 h-10 md:w-12 md:h-12 text-[8px] md:text-[10px] font-bold">
                  <div className="bg-blue-500 text-white rounded-sm flex items-center justify-center">9</div>
                  <div className="bg-purple-500 text-white rounded-sm flex items-center justify-center">1</div>
                  <div className="bg-blue-500 text-white rounded-sm flex items-center justify-center">5</div>
                  <div className="bg-purple-500 text-white rounded-sm flex items-center justify-center">3</div>
                  <div className="bg-yellow-500 text-white rounded-sm flex items-center justify-center">6</div>
                  <div className="bg-purple-500 text-white rounded-sm flex items-center justify-center">2</div>
                  <div className="bg-blue-500 text-white rounded-sm flex items-center justify-center">6</div>
                  <div className="bg-purple-500 text-white rounded-sm flex items-center justify-center">8</div>
                  <div className="bg-blue-500 text-white rounded-sm flex items-center justify-center">4</div>
                </div>
              )}
            </div>
            <h3 className="font-serif text-base md:text-lg font-bold mb-1 group-hover:text-primary transition-colors">
              {game.name}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">{game.difficulty}</p>
          </Link>
        ))}

        {/* Card para "Ver todos" */}
        <Link
          href="/juegos"
          className="group flex flex-col items-center justify-center text-center p-4 md:p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-accent/30 transition-all"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Gamepad2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
          <h3 className="font-serif text-base md:text-lg font-bold text-primary">Ver todos</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Más juegos</p>
        </Link>
      </div>
    </section>
  )
}
