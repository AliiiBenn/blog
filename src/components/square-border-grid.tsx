'use client'

import { useEffect, useRef, useState } from 'react'

interface SquareBorderGridProps {
  className?: string
  targetSquares?: number
}

export function SquareBorderGrid({ className = '', targetSquares = 10 }: SquareBorderGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gridData, setGridData] = useState({
    squareSize: 60,
    cols: 10,
    rows: 6,
  })

  useEffect(() => {
    const updateGridSize = () => {
      if (!containerRef.current) return

      const width = containerRef.current.offsetWidth
      const height = containerRef.current.offsetHeight

      if (width === 0 || height === 0) return

      const idealSize = width / targetSquares
      const cols = Math.floor(width / idealSize)
      const squareSize = Math.floor(width / cols)
      const rows = Math.ceil(height / squareSize)

      setGridData({ squareSize, cols, rows })
    }

    const timer = setTimeout(updateGridSize, 100)
    window.addEventListener('resize', updateGridSize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateGridSize)
    }
  }, [targetSquares])

  const { squareSize, cols, rows } = gridData

  return (
    <div ref={containerRef} className={`${className} absolute inset-0 pointer-events-none`}>
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${squareSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${squareSize}px)`,
          WebkitMaskImage: 'radial-gradient(circle, transparent 0% 40%, black 80%)',
          maskImage: 'radial-gradient(circle, transparent 0% 40%, black 80%)',
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} className="border border-border/30" />
        ))}
      </div>
    </div>
  )
}
