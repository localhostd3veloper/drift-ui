import { ComponentPage } from "@/app/components/[slug]/component-page"

export { generateMetadata, generateStaticParams } from "../page"

export const dynamicParams = false

export default async function BaseUiComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ComponentPage slug={slug} library="base" />
}
