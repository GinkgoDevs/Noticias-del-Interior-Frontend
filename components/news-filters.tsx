"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, Clock, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NewsFiltersProps {
  onSortChange?: (sort: string) => void
  onDateFilterChange?: (filter: string) => void
  showSubcategories?: boolean
  subcategories?: string[]
  activeSubcategory?: string
  onSubcategoryChange?: (subcategory: string) => void
}

export function NewsFilters({
  onSortChange,
  onDateFilterChange,
  showSubcategories = false,
  subcategories = [],
  activeSubcategory = "Todos",
  onSubcategoryChange,
}: NewsFiltersProps) {
  const [sortBy, setSortBy] = useState("recent")
  const [dateFilter, setDateFilter] = useState("all")

  const handleSortChange = (value: string) => {
    setSortBy(value)
    onSortChange?.(value)
  }

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value)
    onDateFilterChange?.(value)
  }

  const handleSubcategoryClick = (subcategory: string) => {
    onSubcategoryChange?.(subcategory)
  }

  return (
    <div className="space-y-6">
      {/* Subcategorías */}
      {showSubcategories && subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-6 border-b border-border">
          <Button
            variant={activeSubcategory === "Todos" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => handleSubcategoryClick("Todos")}
          >
            Todos
          </Button>
          {subcategories.map((subcategory) => (
            <Button
              key={subcategory}
              variant={activeSubcategory === subcategory ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => handleSubcategoryClick(subcategory)}
            >
              {subcategory}
            </Button>
          ))}
        </div>
      )}

      {/* Filtros y ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filtrar y ordenar</span>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Filtro por fecha */}
          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>

          {/* Ordenamiento */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              {sortBy === "recent" && <Clock className="h-4 w-4 mr-2" />}
              {sortBy === "popular" && <TrendingUp className="h-4 w-4 mr-2" />}
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Más recientes
                </div>
              </SelectItem>
              <SelectItem value="popular">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Más populares
                </div>
              </SelectItem>
              <SelectItem value="oldest">Más antiguas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {(dateFilter !== "all" || sortBy !== "recent" || activeSubcategory !== "Todos") && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          {dateFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {dateFilter === "today" && "Hoy"}
              {dateFilter === "week" && "Esta semana"}
              {dateFilter === "month" && "Este mes"}
              {dateFilter === "year" && "Este año"}
            </Badge>
          )}
          {sortBy !== "recent" && (
            <Badge variant="secondary" className="gap-1">
              {sortBy === "popular" ? "Más populares" : "Más antiguas"}
            </Badge>
          )}
          {activeSubcategory !== "Todos" && (
            <Badge variant="secondary" className="gap-1">
              {activeSubcategory}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setSortBy("recent")
              setDateFilter("all")
              handleSortChange("recent")
              handleDateFilterChange("all")
              handleSubcategoryClick("Todos")
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
