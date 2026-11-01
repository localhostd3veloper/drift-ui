import { existsSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import { createPageMetadata } from "@/lib/page-metadata"
import {
  headingId,
  nextResource,
  RESOURCES,
  resourceOutline,
} from "@/lib/resources"
import { siteConfig } from "@/lib/site-config"

describe("resources", () => {
  it("builds anchor ids from headings", () => {
    expect(headingId("Why we're building it in the open")).toBe(
      "why-we-re-building-it-in-the-open"
    )
  })

  it("derives an outline from section headings", () => {
    const [firstPost] = RESOURCES

    expect(resourceOutline(firstPost)).toContainEqual({
      id: "what-drift-ui-is",
      label: "What drift-ui is",
    })
  })

  it("gives every post a TL;DR", () => {
    for (const { slug, tldr } of RESOURCES) {
      expect(tldr.length, slug).toBeGreaterThan(0)
    }
  })

  it("keeps search titles and descriptions short enough to show in full", () => {
    for (const { title, description } of RESOURCES) {
      expect(`${title} | ${siteConfig.name}`.length, title).toBeLessThanOrEqual(
        60
      )
      expect(description.length, title).toBeLessThanOrEqual(160)
    }
  })

  it("shares each post with its cover as an article", () => {
    const [{ title, description, slug, publishedAt, image }] = RESOURCES
    const { openGraph, twitter } = createPageMetadata({
      title,
      description,
      path: `/resources/${slug}`,
      cover: image,
      publishedTime: publishedAt,
    })

    expect(openGraph).toMatchObject({
      type: "article",
      publishedTime: publishedAt,
      images: [{ url: image?.src, alt: image?.alt }],
    })
    expect(twitter).toMatchObject({ images: [{ url: image?.src }] })
  })

  it("keeps outline ids unique within a post", () => {
    for (const resource of RESOURCES) {
      const ids = resourceOutline(resource).map(({ id }) => id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it("points every post at an existing cover image", () => {
    for (const { image } of RESOURCES) {
      if (image) expect(existsSync(join("public", image.src))).toBe(true)
    }
  })

  it("wraps from the last post to the first", () => {
    expect(nextResource(RESOURCES.at(-1)!.slug)).toBe(RESOURCES[0])
  })
})
