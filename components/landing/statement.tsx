import { Principles } from "@/components/landing/principles/principles"
import { ScrollFillText } from "@/components/landing/scroll-fill-text"

export function Statement() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:py-28 md:px-10 md:py-36">
      <ScrollFillText
        text="Same tokens, same Radix internals, same CLI. drift-ui fills the gaps in shadcn without asking you to adopt another design system."
        className="max-w-5xl text-3xl leading-[1.12] font-medium tracking-tighter md:text-5xl"
      />
      <div className="mt-20 md:mt-32">
        <Principles />
      </div>
    </section>
  )
}
