import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import {
  formatResourceDate,
  resourcePath,
  type Resource,
} from "@/lib/resources"

export function ResourceMeta({
  resource,
  className,
}: {
  resource: Resource
  className?: string
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap gap-x-2 font-mono text-xs text-muted-foreground",
        className
      )}
    >
      <time dateTime={resource.publishedAt}>
        {formatResourceDate(resource.publishedAt)}
      </time>
      <span aria-hidden>·</span>
      <span>{resource.readMinutes} min read</span>
    </p>
  )
}

export function ResourceFeature({ resource }: { resource: Resource }) {
  return (
    <Link
      href={resourcePath(resource.slug)}
      prefetch={false}
      className="group grid items-center gap-6 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:grid-cols-12 lg:gap-10"
    >
      {resource.image && (
        <span className="overflow-hidden rounded-2xl border lg:col-span-7">
          <Image
            src={resource.image.src}
            alt={resource.image.alt}
            width={1600}
            height={840}
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority
            fetchPriority="high"
            className="w-full transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
          />
        </span>
      )}
      <span className="flex flex-col gap-4 lg:col-span-5">
        <ResourceMeta resource={resource} />
        <h2 className="font-display text-3xl leading-[1.05] font-semibold tracking-tight text-balance transition-colors group-hover:text-brand md:text-5xl">
          {resource.title}
        </h2>
        <span className="text-lg leading-relaxed text-muted-foreground">
          {resource.description}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          Read the post
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  )
}

export function ResourceRow({ resource }: { resource: Resource }) {
  return (
    <Link
      href={resourcePath(resource.slug)}
      prefetch={false}
      className="group grid grid-cols-[minmax(0,1fr)_6.5rem] items-start gap-x-4 gap-y-3 py-6 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-x-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-8"
    >
      {resource.image && (
        <span className="col-start-2 row-start-1 overflow-hidden rounded-lg border lg:col-span-3 lg:col-start-1 lg:rounded-xl">
          <Image
            src={resource.image.src}
            alt=""
            width={1600}
            height={840}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 176px, 104px"
            className="w-full transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
          />
        </span>
      )}
      <span className="col-start-1 row-start-1 flex flex-col gap-2 lg:col-span-5 lg:col-start-4">
        <ResourceMeta resource={resource} />
        <h2 className="font-display text-xl font-semibold tracking-tight text-balance transition-colors group-hover:text-brand sm:text-2xl">
          {resource.title}
        </h2>
      </span>
      <span className="col-span-2 leading-relaxed text-muted-foreground lg:col-span-4 lg:col-start-9">
        {resource.description}
      </span>
    </Link>
  )
}
