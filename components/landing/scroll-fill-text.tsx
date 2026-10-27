"use client"

import { Fragment, useRef } from "react"
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

  return <motion.span style={{ opacity }}>{word}</motion.span>
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
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 && " "}
          <FillWord
            word={word}
            progress={scrollYProgress}
            range={[index / words.length, (index + 1) / words.length]}
          />
        </Fragment>
      ))}
    </p>
  )
}
