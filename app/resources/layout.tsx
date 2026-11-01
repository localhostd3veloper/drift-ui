import { MotionProvider } from "@/components/landing/motion-provider"

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MotionProvider>{children}</MotionProvider>
}
