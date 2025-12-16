import { cn } from '@/lib/utils'

const baseClasses =
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background'

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background hover:bg-muted hover:text-foreground',
  ghost: 'hover:bg-muted',
}

export function buttonClasses(variant = 'default', className) {
  return cn(baseClasses, variants[variant], className)
}

export function Button({ className, variant = 'default', ...props }) {
  return <button className={buttonClasses(variant, className)} {...props} />
}
