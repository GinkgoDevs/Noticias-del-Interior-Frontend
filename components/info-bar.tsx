"use client"

import { Cloud, Calendar as CalendarIcon, Clock, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface DollarRate {
  name: string
  value: number
  change: number
}

export function InfoBar() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [dollarRates, setDollarRates] = useState<DollarRate[]>([])
  const [weather, setWeather] = useState<{ temp: number | null; city: string }>({ temp: null, city: "Tucumán" })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
      setCurrentDate(
        now.toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      )
    }

    const fetchRates = async () => {
      try {
        // Intento 1: DolarApi (Principal)
        let res = await fetch("https://dolarapi.com/v1/dolares")
        if (!res.ok) throw new Error("API 1 failed")
        let data = await res.json()

        if (!Array.isArray(data)) {
          // Intento 2: ArgentinaDatos (Respaldo)
          res = await fetch("https://api.argentinadatos.com/v1/cotizaciones/dolar")
          data = await res.json()
        }

        const relevantHouses = ["oficial", "blue", "mep", "contadoconliqui"]
        const rates = data
          .filter((d: any) => relevantHouses.includes(d.casa || d.casa.toLowerCase()))
          .map((d: any) => ({
            name: (d.casa === "contadoconliqui" || d.nombre === "Contado con Liqui") ? "CCL" : d.nombre,
            value: d.venta,
            change: 0
          }))

        if (rates.length > 0) setDollarRates(rates)
      } catch (e) {
        console.error("Rates error")
      }
    }

    const fetchWeather = async () => {
      let temp = null;

      try {
        // Intento 1: Open-Meteo V2
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-26.82&longitude=-65.22&current=temperature_2m&timezone=auto")
        const data = await res.json()
        if (data.current?.temperature_2m !== undefined) {
          temp = Math.round(data.current.temperature_2m)
        } else {
          // Intento 2: Open-Meteo Legacy
          const res2 = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-26.82&longitude=-65.22&current_weather=true")
          const data2 = await res2.json()
          if (data2.current_weather?.temperature !== undefined) {
            temp = Math.round(data2.current_weather.temperature)
          }
        }
      } catch (e) {
        // Intento 3: wttr.in (Proveedor alternativo muy estable)
        try {
          const res3 = await fetch("https://wttr.in/Tucuman?format=j1")
          const data3 = await res3.json()
          temp = parseInt(data3.current_condition[0].temp_C)
        } catch (e2) {
          console.error("All weather sources failed")
        }
      }

      if (temp !== null) {
        setWeather({ temp, city: "Tucumán" })
      }
      setIsLoading(false)
    }

    updateDateTime()
    fetchRates()
    fetchWeather()

    const interval = setInterval(updateDateTime, 60000)
    const apiInterval = setInterval(() => {
      fetchRates()
      fetchWeather()
    }, 300000)

    return () => {
      clearInterval(interval)
      clearInterval(apiInterval)
    }
  }, [])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const formattedDate = `${year}-${month}-${day}`
      router.push(`/archivo/${formattedDate}`)
    }
  }

  const duplicatedRates = [...dollarRates, ...dollarRates]

  // Solo mostramos el esqueleto si no tenemos NADA de información
  if (isLoading && dollarRates.length === 0 && weather.temp === null) {
    return (
      <div className="w-full h-11 border-b border-border/50 bg-background/50 backdrop-blur-md animate-pulse flex items-center px-6">
        <div className="h-4 w-32 bg-muted rounded" />
      </div>
    )
  }

  return (
    <div className="w-full border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-[60]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 text-nowrap">
        <div className="flex h-11 items-center justify-between overflow-hidden">

          {/* Cotizaciones Dólar */}
          <div className="flex-1 lg:flex-none overflow-hidden lg:overflow-visible">
            {dollarRates.length > 0 ? (
              <>
                <div className="lg:hidden relative">
                  <div className="flex animate-scroll-infinite">
                    {duplicatedRates.map((rate, index) => (
                      <div key={`${rate.name}-${index}`} className="flex items-center gap-2 px-6 border-r border-border/30">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{rate.name}</span>
                        <span className="text-sm font-black text-foreground tabular-nums">${rate.value.toLocaleString("es-AR")}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-10">
                  {dollarRates.map((rate, index) => (
                    <div key={rate.name} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{rate.name}</span>
                      <span className="text-sm font-black text-foreground tabular-nums">${rate.value.toLocaleString("es-AR")}</span>
                      {index < dollarRates.length - 1 && <div className="h-4 w-px bg-border/40 ml-4" />}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-border animate-pulse" />
                <span className="text-[10px] font-medium text-muted-foreground uppercase">Actualizando cotizaciones...</span>
              </div>
            )}
          </div>

          {/* Clima, Fecha y Hora */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-sky-500/5 border border-sky-500/10 transition-all hover:bg-sky-500/10">
              <Cloud className="h-4 w-4 text-sky-500" />
              <div className="flex flex-col -space-y-1">
                <span className="text-[9px] font-bold text-sky-600 uppercase tracking-tighter">{weather.city}</span>
                <span className="text-xs font-black text-foreground tabular-nums">
                  {weather.temp !== null ? `${weather.temp}°C` : "Cargando..."}
                </span>
              </div>
            </div>

            <div className="h-4 w-px bg-border/50" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-transparent hover:border-border/50 hover:bg-muted/40 transition-all outline-none group">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-xs font-bold text-foreground/80 capitalize">{currentDate}</span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-transform group-data-[state=open]:rotate-180" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="bg-background"
                      />
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium">
                  Ver archivo de noticias por fecha
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/50">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-black text-foreground tabular-nums">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
