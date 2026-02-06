import * as React from "react"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input">

export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn("input", className)}
      {...props}
    />
  )
}
