import { cn } from '@/lib/utils'

interface DecorativeWaveProps {
  /** Mirror the wave vertically (useful for bottom-to-top transitions). */
  flip?: boolean
  className?: string
}

export function DecorativeWave({ flip = false, className }: DecorativeWaveProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden leading-[0]',
        flip && 'rotate-180',
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1920 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="decorativeWaveGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7960a9" />
            <stop offset="100%" stopColor="#9b7ec4" />
          </linearGradient>
        </defs>
        <path
          d="M0 80C320 20 640 100 960 60C1280 20 1600 90 1920 50V120H0V80Z"
          fill="url(#decorativeWaveGradient)"
        />
      </svg>
    </div>
  )
}
