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
    {
      name: "Crucigrama",
      difficulty: "Avanzado",
      icon: "crucigrama",
      href: "/juegos/crucigrama",
      description: "Desafío de palabras diario",
    },
  ]

  return (
    <section className="border-t border-primary/10 pt-12 pb-20 reveal-staggered">
      <div className="flex items-center justify-between mb-10">
        <Link
          href="/juegos"
          className="group flex items-end gap-4"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight group-hover:text-primary transition-colors">
            Pasatiempos
          </h2>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-primary pb-1 group-hover:translate-x-2 transition-transform duration-500">
            Descubrir más ›
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {games.map((game, index) => (
          <Link
            key={index}
            href={game.href}
            className="group flex flex-col items-center text-center p-6 md:p-8 glass-panel border-primary/5 hover:border-primary/30 transition-all duration-700 hover:-translate-y-2"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 mb-6 flex items-center justify-center rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors shadow-inner">
              {game.icon === "wordle" && (
                <div className="grid grid-cols-5 gap-1 w-12 h-12 md:w-14 md:h-14">
                  <div className="bg-green-500/80 rounded-sm"></div>
                  <div className="bg-yellow-500/80 rounded-sm"></div>
                  <div className="bg-foreground/5 rounded-sm"></div>
                  <div className="bg-green-500/80 rounded-sm"></div>
                  <div className="bg-foreground/5 rounded-sm"></div>
                  <div className="bg-foreground/5 rounded-sm"></div>
                  <div className="bg-green-500/80 rounded-sm"></div>
                  <div className="bg-yellow-500/80 rounded-sm"></div>
                  <div className="bg-foreground/5 rounded-sm"></div>
                  <div className="bg-green-500/80 rounded-sm"></div>
                </div>
              )}
              {game.icon === "sudoku" && (
                <div className="grid grid-cols-3 gap-1 w-12 h-12 md:w-14 md:h-14 text-[10px] md:text-xs font-black">
                  <div className="bg-blue-500/80 text-white rounded-sm flex items-center justify-center">9</div>
                  <div className="bg-primary/80 text-white rounded-sm flex items-center justify-center">1</div>
                  <div className="bg-blue-500/80 text-white rounded-sm flex items-center justify-center">5</div>
                  <div className="bg-primary/80 text-white rounded-sm flex items-center justify-center">3</div>
                  <div className="bg-yellow-500/80 text-white rounded-sm flex items-center justify-center">6</div>
                  <div className="bg-primary/80 text-white rounded-sm flex items-center justify-center">2</div>
                  <div className="bg-blue-500/80 text-white rounded-sm flex items-center justify-center">6</div>
                  <div className="bg-primary/80 text-white rounded-sm flex items-center justify-center">8</div>
                  <div className="bg-blue-500/80 text-white rounded-sm flex items-center justify-center">4</div>
                </div>
              )}
              {game.icon === "crucigrama" && (
                <div className="flex flex-col gap-1 w-12 h-12 md:w-14 md:h-14">
                  <div className="flex gap-1 h-1/3">
                    <div className="bg-primary/80 rounded-sm w-1/3"></div>
                    <div className="bg-foreground/5 rounded-sm w-1/3"></div>
                    <div className="bg-primary/80 rounded-sm w-1/3"></div>
                  </div>
                  <div className="flex gap-1 h-1/3">
                    <div className="bg-foreground/5 rounded-sm w-1/3"></div>
                    <div className="bg-primary/80 rounded-sm w-1/3"></div>
                    <div className="bg-foreground/5 rounded-sm w-1/3"></div>
                  </div>
                  <div className="flex gap-1 h-1/3">
                    <div className="bg-primary/80 rounded-sm w-1/3"></div>
                    <div className="bg-foreground/5 rounded-sm w-1/3"></div>
                    <div className="bg-primary/80 rounded-sm w-1/3"></div>
                  </div>
                </div>
              )}
            </div>
            <h3 className="font-serif text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors tracking-tight">
              {game.name}
            </h3>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">{game.difficulty}</p>
          </Link>
        ))}

        {/* Card para "Ver todos" */}
        <Link
          href="/juegos"
          className="group flex flex-col items-center justify-center text-center p-6 md:p-8 border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-500"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 mb-6 flex items-center justify-center rounded-2xl bg-primary/5 group-hover:bg-primary/20 transition-all duration-700">
            <Gamepad2 className="w-10 h-10 md:w-12 md:h-12 text-primary transform group-hover:rotate-12 transition-transform duration-500" />
          </div>
          <h3 className="font-serif text-lg md:text-xl font-bold text-primary tracking-tight">Expandir</h3>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Todos los juegos</p>
        </Link>
      </div>
    </section>
  )
}
