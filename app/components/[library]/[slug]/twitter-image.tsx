import ComponentOpenGraphImage, {
  generateStaticParams,
} from "./opengraph-image"
import { siteConfig } from "@/lib/site-config"

export const alt = `A ${siteConfig.name} component`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export { generateStaticParams }

export default ComponentOpenGraphImage
