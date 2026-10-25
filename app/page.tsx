import { BlocksSection } from "@/components/landing/blocks-section"
import { ClosingCta } from "@/components/landing/closing-cta"
import { ComponentIndex } from "@/components/landing/component-index"
import { Hero } from "@/components/landing/hero"
import { MotionProvider } from "@/components/landing/motion-provider"
import { InstallSection } from "@/components/landing/install-section"
import { MoreComponentsSection } from "@/components/landing/more-components-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import { Statement } from "@/components/landing/statement"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/site-config"

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/exports/drift-ui-avatar-1024.png`,
    },
  ],
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <JsonLd schema={WEBSITE_SCHEMA} />
      <MotionProvider>
        <SiteNav />
        <main>
          <Hero />
          <Statement />
          <ComponentIndex />
          <MoreComponentsSection />
          <BlocksSection />
          <InstallSection />
          <ClosingCta />
        </main>
        <SiteFooter />
      </MotionProvider>
    </div>
  )
}
