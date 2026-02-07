"use client"

import { useEffect, useRef, useState } from "react"

interface SquareBorderCornerProps {
  className?: string
  targetHorizontalSquares?: number
  targetVerticalSquares?: number
  squareSize?: number
}

export function SquareBorderCorner({
  className = "",
  targetHorizontalSquares = 10,
  targetVerticalSquares = 6,
  squareSize = 80,
}: SquareBorderCornerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [squaresData, setSquaresData] = useState<{
    size: number
    horizontalCount: number
    verticalCount: number
  }>({
    size: squareSize,
    horizontalCount: targetHorizontalSquares,
    verticalCount: targetVerticalSquares,
  })

  useEffect(() => {
    const updateSquareSize = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const containerHeight = containerRef.current.offsetHeight

      if (containerWidth === 0 || containerHeight === 0) return

      // Calculer la taille des carrés basée sur la largeur (priorité horizontale)
      const idealSquareSize = containerWidth / targetHorizontalSquares
      const horizontalSquaresCount = Math.floor(containerWidth / idealSquareSize)
      const finalSquareSize = Math.floor(containerWidth / horizontalSquaresCount)

      // Calculer combien de carrés verticaux on peut avoir avec cette taille
      const verticalSquaresCount = Math.ceil(containerHeight / finalSquareSize)

      setSquaresData({
        size: finalSquareSize,
        horizontalCount: horizontalSquaresCount,
        verticalCount: verticalSquaresCount,
      })
    }

    // Attendre que le DOM soit prêt
    const timer = setTimeout(updateSquareSize, 100)

    // Recalculer au redimensionnement
    window.addEventListener("resize", updateSquareSize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateSquareSize)
    }
  }, [targetHorizontalSquares, targetVerticalSquares])

  const { size, horizontalCount, verticalCount } = squaresData

  return (
    <div ref={containerRef} className={`${className} absolute inset-0 pointer-events-none`}>
      {/* Ligne horizontale en bas */}
      <div className="absolute bottom-0 left-0 right-0 flex">
        {Array.from({ length: horizontalCount }).map((_, i) => (
          <div
            key={`bottom-${i}`}
            className="flex-shrink-0 border-t border-b border-r border-border/30"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {/* Ligne horizontale en haut */}
      <div className="absolute top-0 left-0 right-0 flex">
        {Array.from({ length: horizontalCount }).map((_, i) => (
          <div
            key={`top-${i}`}
            className="flex-shrink-0 border-t border-b border-r border-border/30"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {/* Colonne verticale à gauche */}
      <div className="absolute top-0 left-0 bottom-0 flex flex-col">
        {Array.from({ length: verticalCount }).map((_, i) => (
          <div
            key={`left-${i}`}
            className="flex-shrink-0 border-l border-r border-b border-border/30"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {/* Colonne verticale à droite */}
      <div className="absolute top-0 right-0 bottom-0 flex flex-col">
        {Array.from({ length: verticalCount }).map((_, i) => (
          <div
            key={`right-${i}`}
            className="flex-shrink-0 border-l border-r border-b border-border/30"
            style={{ width: size, height: size }}
          />
        ))}
      </div>
    </div>
  )
}
