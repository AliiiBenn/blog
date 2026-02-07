interface VerticalCrossProps {
  className?: string
}

export function VerticalCross({ className = '' }: VerticalCrossProps) {
  return (
    <div className={`${className} pointer-events-none`}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 6H11M6 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}
