import OpenGraphImage from "./opengraph-image"
import { siteConfig } from "@/lib/site-config"

export const alt = siteConfig.title
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default OpenGraphImage
