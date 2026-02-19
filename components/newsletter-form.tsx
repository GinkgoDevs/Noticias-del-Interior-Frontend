"use client"

import { useState, useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { subscribeToNewsletter, type NewsletterState } from "@/lib/actions"
import { cn } from "@/lib/utils"

const initialState: NewsletterState = {
    success: false,
    message: "",
};

export function NewsletterForm() {
    const [email, setEmail] = useState("")
    const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message)
                setEmail("")
            } else if (state.message !== "Datos inválidos") {
                toast.error(state.message)
            }
        }
    }, [state]);

    return (
        <form action={formAction} className="space-y-3">
            <input
                name="email"
                type="email"
                placeholder="Tu correo electrónico"
                className={cn(
                    "w-full rounded-lg py-3 px-4 text-sm outline-none transition-all",
                    "bg-background/80 border border-border focus:ring-2 focus:ring-primary/50 focus:border-transparent text-foreground placeholder-muted-foreground",
                    "dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-white/60"
                )}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            {state.errors?.email && (
                <p className="text-[10px] text-destructive font-bold uppercase tracking-widest px-1">
                    {state.errors.email[0]}
                </p>
            )}
            <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-black py-3 rounded-lg hover:bg-primary/90 transition-all uppercase text-sm tracking-widest h-12 shadow-lg shadow-primary/20"
                disabled={isPending}
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Suscribirme Gratis
            </Button>
        </form>
    )
}
