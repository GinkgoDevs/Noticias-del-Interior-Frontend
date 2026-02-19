"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Mail, Link2, MessageCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface SocialShareProps {
  url: string
  title: string
  description?: string
  variant?: "button" | "icons"
}

export function SocialShare({ url, title, description, variant = "button" }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const shareUrl = typeof window !== "undefined" ? window.location.origin + url : url
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = description ? encodeURIComponent(description) : ""

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Enlace copiado",
        description: "El enlace se copió al portapapeles correctamente",
      })
      setIsOpen(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
        variant: "destructive",
      })
    }
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer,width=600,height=600")
    setIsOpen(false)
  }

  if (variant === "icons") {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
          onClick={() => handleShare("facebook")}
        >
          <Facebook className="h-5 w-5" />
          <span className="sr-only">Compartir en Facebook</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
          onClick={() => handleShare("twitter")}
        >
          <Twitter className="h-5 w-5" />
          <span className="sr-only">Compartir en Twitter</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
          onClick={() => handleShare("whatsapp")}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="sr-only">Compartir en WhatsApp</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
          onClick={() => handleShare("linkedin")}
        >
          <Linkedin className="h-5 w-5" />
          <span className="sr-only">Compartir en LinkedIn</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
          onClick={() => handleShare("email")}
        >
          <Mail className="h-5 w-5" />
          <span className="sr-only">Compartir por email</span>
        </Button>
      </div>
    )
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="gap-2 bg-transparent opacity-50">
        <Link2 className="h-4 w-4" />
        Compartir
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Link2 className="h-4 w-4" />
          Compartir
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare("facebook")} className="gap-2 cursor-pointer">
          <Facebook className="h-4 w-4" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")} className="gap-2 cursor-pointer">
          <Twitter className="h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="gap-2 cursor-pointer">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("linkedin")} className="gap-2 cursor-pointer">
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("email")} className="gap-2 cursor-pointer">
          <Mail className="h-4 w-4" />
          Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
          <Link2 className="h-4 w-4" />
          Copiar enlace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
