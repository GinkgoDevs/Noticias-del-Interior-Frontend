export function CorresponsaliasWidget() {
    const cities = [
        { name: "Córdoba", active: true },
        { name: "Mendoza", active: true },
        { name: "Salta", active: true },
        { name: "Neuquén", active: true },
        { name: "Tucumán", active: true },
        { name: "Rosario", active: true },
    ]

    return (
        <div className="bg-surface-dark rounded-xl p-6 border border-primary/10">
            <h3 className="text-lg font-bold mb-4">Corresponsalías</h3>
            <div className="rounded-lg overflow-hidden h-48 bg-card relative">
                {/* Map background placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-card via-surface-dark to-card opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-primary/80 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full text-white">
                        34 PERIODISTAS EN VIVO
                    </span>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                {cities.map((city) => (
                    <span key={city.name} className="flex items-center">
                        <span className={`w-1.5 h-1.5 ${city.active ? 'bg-green-500' : 'bg-gray-500'} rounded-full mr-2 ${city.active ? 'animate-pulse' : ''}`} />
                        {city.name}
                    </span>
                ))}
            </div>
        </div>
    )
}
