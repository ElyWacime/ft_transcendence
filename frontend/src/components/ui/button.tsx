import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
type ButtonSize = "default" | "sm" | "lg" | "icon"

function getButtonClasses(
  variant: ButtonVariant = "default",
  size: ButtonSize = "default"
): string {
  const variantClass = `button-${variant}`
  const sizeClass = `button-size-${size}`
  return `button ${variantClass} ${sizeClass}`
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(getButtonClasses(variant, size), className)}
      {...props}
    />
  )
}
