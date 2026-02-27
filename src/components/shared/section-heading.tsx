import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  badge?: string
  title: string
  subtitle?: string
  /** true = dark text on light background, false = light text on dark background */
  light?: boolean
  centered?: boolean
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  light = false,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && 'text-center')}>
      {badge && (
        <span
          className={cn(
            'inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4',
            light
              ? 'bg-brand-purple/10 text-brand-purple'
              : 'bg-brand-white/10 text-brand-white'
          )}
        >
          {badge}
        </span>
      )}

      <h2
        className={cn(
          'font-clash text-[28px] md:text-[36px] lg:text-[48px] font-bold uppercase tracking-tight leading-tight',
          light ? 'text-brand-black' : 'text-brand-white'
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base md:text-lg leading-relaxed',
            centered && 'mx-auto',
            light ? 'text-brand-black/70' : 'text-brand-gray'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
