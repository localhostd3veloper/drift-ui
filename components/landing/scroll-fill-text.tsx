"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

const DIM_OPACITY = 0.22

function FillWord({
  word,
  progress,
  range,
}: {
  word: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [DIM_OPACITY, 1])

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{word}</span>
      <motion.span style={{ opacity }} className="absolute inset-0">
        {word}
      </motion.span>
    </span>
  )
}

export function ScrollFillText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.45"],
  })
  const words = text.split(" ")

  return (
    <p ref={containerRef} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="flex flex-wrap gap-x-[0.25em]">
        {words.map((word, index) => (
          <FillWord
            key={`${word}-${index}`}
            word={word}
            progress={scrollYProgress}
            range={[index / words.length, (index + 1) / words.length]}
          />
        ))}
      </span>
    </p>
  )
}
