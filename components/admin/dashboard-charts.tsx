'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

interface DashboardChartsProps {
    data: { name: string; views: number }[]
}

const chartConfig: ChartConfig = {
    views: {
        label: "Vistas",
        color: "hsl(var(--primary))",
    },
}

export function DashboardCharts({ data }: DashboardChartsProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground py-20">
                No hay datos suficientes para mostrar el gráfico
            </div>
        )
    }

    return (
        <div className="h-[400px] w-full mt-4">
            <ChartContainer config={chartConfig}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        hide
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 500 }}
                        width={140}
                        tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                    />
                    <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    />
                    <Bar
                        dataKey="views"
                        fill="var(--color-views)"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    )
}
