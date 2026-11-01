import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { Button } from "@/registry/default/ui/button"
import { DocSection } from "@/components/docs/doc-section"
import {
  OnThisPage,
  OnThisPageDisclosure,
} from "@/components/docs/on-this-page"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import { ContributorAvatar } from "@/components/contributors/contributor-avatar"
import { Tldr } from "@/components/resources/article-blocks"
import {
  ResourceMeta,
  ResourceTagLinks,
} from "@/components/resources/resource-card"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/page-metadata"
import {
  findResource,
  headingId,
  nextResource,
  RESOURCES,
  resourceOutline,
  resourcePath,
  type Resource,
} from "@/lib/resources"
import { siteConfig } from "@/lib/site-config"

const MIN_OUTLINE_ITEMS = 3

type ResourcePageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return RESOURCES.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params
  const resource = findResource(slug)
  if (!resource) return {}

  return createPageMetadata({
    title: resource.title,
    description: resource.description,
    path: resourcePath(slug),
    cover: resource.image,
    publishedTime: resource.publishedAt,
  })
}

function buildArticleSchema(resource: Resource) {
  const url = new URL(resourcePath(resource.slug), siteConfig.url).toString()
  const publisher = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: resource.title,
    description: resource.description,
    datePublished: resource.publishedAt,
    url,
    mainEntityOfPage: url,
    image:
      resource.image && new URL(resource.image.src, siteConfig.url).toString(),
    keywords: resource.tags,
    author: {
      "@type": "Person",
      name: resource.author.name,
      url: resource.author.website,
      sameAs: `https://github.com/${resource.author.login}`,
    },
    publisher,
    inLanguage: "en",
  }
}

function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  return paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params
  const resource = findResource(slug)
  if (!resource) notFound()

  const outline = resourceOutline(resource)
  const hasOutline = outline.length >= MIN_OUTLINE_ITEMS
  const next = nextResource(slug)

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <JsonLd schema={buildArticleSchema(resource)} />
      <SiteNav />
      <main className="flex-1 pb-24">
        <header className="dark bg-background text-foreground">
          <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,44rem)] justify-center gap-x-12 gap-y-2 px-4 pt-6 md:px-10 xl:h-[clamp(28rem,100dvh-12rem,38rem)] xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:pt-0">
            <div className="flex min-w-0 flex-col gap-5">
              <Link
                href="/resources"
                className="flex h-11 w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeftIcon className="size-3.5" />
                Resources
              </Link>
              <ResourceMeta
                resource={resource}
                author={
                  <a
                    href={`https://github.com/${resource.author.login}`}
                    className="flex min-h-6 items-center gap-2 text-foreground transition-colors hover:text-brand"
                  >
                    <ContributorAvatar
                      login={resource.author.login}
                      sizePx={24}
                    />
                    {resource.author.name}
                  </a>
                }
                className="rise"
              />
              <h1 className="rise font-display text-[clamp(2.5rem,3.4vw,3rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance [--rise-delay:80ms]">
                {resource.title.replaceAll("drift-ui", "drift\u2011ui")}
              </h1>
              <p className="rise text-lg leading-relaxed text-muted-foreground [--rise-delay:160ms]">
                {resource.description}
              </p>
              <ResourceTagLinks
                tags={resource.tags}
                className="rise [--rise-delay:240ms]"
              />
            </div>
            {resource.image && (
              <div className="relative mx-auto aspect-103/100 w-full max-w-lg mask-x-from-95% mask-b-from-92% xl:w-[calc(1.03*clamp(28rem,100dvh-12rem,38rem))] xl:max-w-none">
                <Image
                  src={resource.image.src}
                  alt={resource.image.alt}
                  fill
                  sizes="(min-width: 1280px) 1160px, (min-width: 512px) 1024px, 200vw"
                  priority
                  className="object-cover object-right"
                />
              </div>
            )}
          </div>
        </header>
        <div
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-[minmax(0,44rem)] justify-center gap-x-16 px-4 pt-10 md:px-10 lg:pt-14 xl:justify-start",
            hasOutline && "xl:grid-cols-[minmax(0,44rem)_13rem]"
          )}
        >
          <div className="flex min-w-0 flex-col gap-8">
            <article className="flex flex-col gap-10">
              <Tldr items={resource.tldr} />

              {hasOutline && (
                <OnThisPageDisclosure
                  sections={outline}
                  className="xl:hidden"
                />
              )}

              <div className="flex flex-col gap-12 text-lg leading-[1.7] text-foreground/80 [&_:is(p,li,td)_a]:text-brand [&_:is(p,li,td)_a]:underline [&_:is(p,li,td)_a]:underline-offset-4 [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:box-decoration-clone [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em] [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-3 [&_ul]:pl-5 [&_ul]:marker:text-muted-foreground">
                {resource.sections.map(({ heading, paragraphs }, index) =>
                  heading ? (
                    <DocSection
                      key={heading}
                      id={headingId(heading)}
                      title={heading}
                    >
                      <Paragraphs paragraphs={paragraphs} />
                    </DocSection>
                  ) : (
                    <div key={index} className="flex flex-col gap-5">
                      <Paragraphs paragraphs={paragraphs} />
                    </div>
                  )
                )}
                {resource.Content && <resource.Content />}
              </div>
            </article>

            <footer className="mt-6 flex flex-col gap-4 border-t pt-10">
              <div className="flex flex-col gap-5 rounded-2xl border bg-card p-6 text-card-foreground sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <p className="font-display text-xl font-semibold tracking-tight">
                    Your first pull request can start here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    A maintainer reads every pull request on drift-ui.
                  </p>
                </div>
                <Button asChild size="lg" className="h-11 shrink-0">
                  <a href={`${siteConfig.repo}/labels/good%20first%20issue`}>
                    Find a good first issue
                    <ArrowRightIcon />
                  </a>
                </Button>
              </div>

              {next && (
                <Link
                  href={resourcePath(next.slug)}
                  rel="next"
                  className="group flex items-center justify-between gap-6 rounded-2xl border p-6 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Next post
                    </span>
                    <span className="font-medium text-balance">
                      {next.title}
                    </span>
                  </span>
                  <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </footer>
          </div>

          {hasOutline && (
            <aside className="hidden xl:block">
              <OnThisPage sections={outline} />
            </aside>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
