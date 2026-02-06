import * as React from "react"
import { cn } from "@/lib/utils"

type DivProps = React.HTMLAttributes<HTMLDivElement>
type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("card", className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("card-header", className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: HeadingProps) {
  return (
    <h3
      className={cn("card-title", className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn("card-description", className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("card-content", className)}
      {...props}
    />
  )
}

export function CardFooter({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("card-footer", className)}
      {...props}
    />
  )
}
