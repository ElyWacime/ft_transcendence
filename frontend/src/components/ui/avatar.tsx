import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  src?: string;
  alt?: string;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <div className={cn("avatar", className)} {...props}>
      {children}
    </div>
  );
}

export function AvatarImage({ className, src, alt, ...props }: AvatarImageProps) {
  return <img className={cn("avatar-image", className)} src={src} alt={alt} {...props} />;
}

export function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <div className={cn("avatar-fallback", className)} {...props}>
      {children}
    </div>
  );
}