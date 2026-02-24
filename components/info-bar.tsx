"use client"

import { Cloud, ArrowDown, ArrowUp, Zap, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { AdBanner } from "./ad-banner"

interface DollarRate {
  name: string
  buy: number
  sell: number
  change: number
}

export function InfoBar() {
  const router = useRouter()
  const [dollarRates, setDollarRates] = useState<DollarRate[]>([])
  const [weather, setWeather] = useState<{ temp: number | null; min: number; max: number; desc: string }>({
    temp: 25,
    min: 21,
    max: 30,
    desc: "Nublado"
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const fetchRates = async () => {
      try {
        const res = await fetch("https://dolarapi.com/v1/dolares")
        const data = await res.json()
        const blue = data.find((d: any) => d.casa === "blue")
        if (blue) {
          setDollarRates([{
            name: "DÓLAR BLUE",
            buy: blue.compra,
            sell: blue.venta,
            change: 0
          }])
        }
      } catch (e) {
        console.error("Rates error")
      }
    }

    const fetchWeather = async () => {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-26.82&longitude=-65.22&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto")
        const data = await res.json()
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            min: Math.round(data.daily.temperature_2m_min[0]),
            max: Math.round(data.daily.temperature_2m_max[0]),
            desc: "Nublado" // Simplified for logic, could be mapped from weather_code
          })
        }
      } catch (e) {
        console.error("Weather error")
      }
    }

    fetchRates()
    fetchWeather()
  }, [])

  if (!isMounted) return null

  return (
    <div className="bg-surface-dark border-b border-foreground/5 overflow-hidden transition-colors">
      <div className="container mx-auto px-4">
        {/* Mobile Ticker */}
        <div className="lg:hidden flex items-center h-10 overflow-hidden relative">
          <div className="flex items-center space-x-8 animate-ticker whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <Cloud className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Tucumán {weather.temp}°</span>
              <span className="text-[10px] text-muted-foreground">{weather.desc}</span>
            </div>
            {dollarRates.length > 0 && (
              <div className="flex items-center space-x-2 border-l border-foreground/10 pl-8">
                <span className="text-xs font-black text-foreground">{dollarRates[0].name}</span>
                <span className="text-xs font-bold text-green-600 dark:text-green-500">${dollarRates[0].sell}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 border-l border-foreground/10 pl-8">
              <Zap className="h-3 w-3 text-yellow-500 dark:text-yellow-400" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Anunciá aquí</span>
            </div>
            {/* Repeat for seamless loop */}
            <div className="flex items-center space-x-2">
              <Cloud className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Tucumán {weather.temp}°</span>
            </div>
          </div>
        </div>

        {/* Desktop Version */}
        <div className="hidden lg:flex">
          {/* Weather Section */}
          <div className="flex items-center py-4 pr-8 border-r border-foreground/10">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="mr-8">
                  <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Hoy</span>
                  <span className="block text-sm font-bold text-foreground leading-tight">{weather.desc}</span>
                  <div className="flex items-center">
                    <span className="text-4xl font-bold text-foreground">{weather.temp}°</span>
                    <Cloud className="text-primary ml-3 h-8 w-8" />
                  </div>
                  <div className="flex space-x-3 text-[10px] text-muted-foreground mt-1">
                    <span className="flex items-center"><ArrowDown className="h-2.5 w-2.5 mr-1" />{weather.min}°</span>
                    <span className="flex items-center"><ArrowUp className="h-2.5 w-2.5 mr-1" />{weather.max}°</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pl-8 border-l border-foreground/5">
                <div className="flex items-center justify-between min-w-[140px]">
                  <div>
                    <span className="block text-[10px] text-muted-foreground font-bold uppercase">Mañana</span>
                    <span className="text-xs text-foreground/80">Despejado</span>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-xs font-bold text-foreground">{weather.min + 1}° / {weather.max + 1}°</span>
                  </div>
                </div>
                <div className="flex items-center justify-between min-w-[140px]">
                  <div>
                    <span className="block text-[10px] text-muted-foreground font-bold uppercase">Miércoles</span>
                    <span className="text-xs text-foreground/80">Soleado</span>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-xs font-bold text-foreground">{weather.min + 2}° / {weather.max + 1}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Section */}
          <div className="px-12 flex items-center border-r border-foreground/10">
            {dollarRates.length > 0 && (
              <div className="min-w-[150px]">
                <div className="flex items-center justify-center mb-1">
                  <span className="text-xs font-black text-foreground mr-2">{dollarRates[0].name}</span>
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-500">0,00%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <span className="block text-[9px] text-muted-foreground font-bold uppercase">Compra</span>
                    <span className="text-xl font-bold text-foreground tracking-tight">{dollarRates[0].buy}</span>
                  </div>
                  <div className="w-px h-8 bg-foreground/10 mx-6"></div>
                  <div className="text-center">
                    <span className="block text-[9px] text-muted-foreground font-bold uppercase">Venta</span>
                    <span className="text-xl font-bold text-foreground tracking-tight">{dollarRates[0].sell}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advertising Section */}
          <div className="flex-1 min-w-[300px] flex items-stretch">
            <AdBanner
              position="HEADER"
              className="w-full h-full rounded-none border-0"
              fallback={
                <div className="w-full h-full bg-[#FFD700] hover:bg-[#FFC000] transition-colors cursor-pointer flex items-center px-10 relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center w-full">
                    <span className="text-black font-black text-lg tracking-tighter leading-none uppercase">Publicidad</span>
                    <span className="text-[10px] text-black/60 font-bold uppercase tracking-widest mt-1">Espacio disponible</span>
                  </div>
                  <div className="ml-6 relative z-10 hidden xl:flex items-center">
                    <div className="border-2 border-black/20 p-2 rounded text-black text-xs font-bold flex items-center">
                      ANUNCIÁ AQUÍ <Zap className="h-3 w-3 ml-2" />
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
