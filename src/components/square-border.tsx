"use client"

import { useEffect, useRef, useState } from "react"

interface SquareBorderProps {
  className?: string
  targetSquares?: number // Nombre souhaité de carrés (ex: 10)
  squareSize?: number // Taille de base d'un carré en px
}

export function SquareBorder({ className = "", targetSquares = 10, squareSize = 80 }: SquareBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [squaresData, setSquaresData] = useState<{ size: number; count: number }>({
    size: squareSize,
    count: targetSquares,
  })

  useEffect(() => {
    const updateSquareSize = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth

      // Calculer pour avoir un nombre entier de carrés
      // On essaie d'avoir environ targetSquares carrés
      const idealSquareSize = containerWidth / targetSquares

      // Ajuster pour avoir un nombre entier
      const squaresCount = Math.floor(containerWidth / idealSquareSize)
      const finalSquareSize = Math.floor(containerWidth / squaresCount)

      setSquaresData({ size: finalSquareSize, count: squaresCount })
    }

    updateSquareSize()

    // Recalculer au redimensionnement
    window.addEventListener("resize", updateSquareSize)
    return () => window.removeEventListener("resize", updateSquareSize)
  }, [targetSquares])

  return (
    <div ref={containerRef} className={`${className} flex`}>
      {Array.from({ length: squaresData.count }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 pointer-events-none border-t border-b border-r border-border/30"
          style={{ width: squaresData.size, height: squaresData.size }}
        />
      ))}
    </div>
  )
}

interface SquareBorderVerticalProps {
  className?: string
  targetSquares?: number
  squareSize?: number
  horizontalSize?: number // Taille fixe des carrés horizontaux pour synchroniser
}

export function SquareBorderVertical({ className = "", targetSquares = 6, squareSize = 80, horizontalSize }: SquareBorderVerticalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [squaresData, setSquaresData] = useState<{ size: number; count: number }>({
    size: squareSize,
    count: targetSquares,
  })

  useEffect(() => {
    const updateSquareSize = () => {
      if (!containerRef.current) return

      const containerHeight = containerRef.current.offsetHeight

      if (containerHeight === 0) return

      // Si horizontalSize est fourni, l'utiliser pour la taille des carrés
      if (horizontalSize) {
        const squaresCount = Math.ceil(containerHeight / horizontalSize)
        setSquaresData({ size: horizontalSize, count: squaresCount })
        return
      }

      // Calculer pour avoir un nombre entier de carrés
      const idealSquareSize = containerHeight / targetSquares

      // Ajuster pour avoir un nombre entier
      const squaresCount = Math.ceil(containerHeight / idealSquareSize)
      const finalSquareSize = Math.ceil(containerHeight / squaresCount)

      setSquaresData({ size: finalSquareSize, count: squaresCount })
    }

    // Attendre que le DOM soit prêt
    const timer = setTimeout(updateSquareSize, 100)

    // Recalculer au redimensionnement
    window.addEventListener("resize", updateSquareSize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateSquareSize)
    }
  }, [targetSquares, horizontalSize])

  return (
    <div ref={containerRef} className={`${className} flex flex-col`}>
      {Array.from({ length: squaresData.count }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 pointer-events-none border-l border-r border-b border-border/30"
          style={{ width: squaresData.size, height: squaresData.size }}
        />
      ))}
    </div>
  )
}
