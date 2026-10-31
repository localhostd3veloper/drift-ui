import { MotionProvider } from "@/components/landing/motion-provider"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <MotionProvider>
        <SiteNav />
        {children}
        <SiteFooter />
      </MotionProvider>
    </div>
  )
}
