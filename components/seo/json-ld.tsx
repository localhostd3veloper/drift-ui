export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  const serializedSchema = JSON.stringify(schema).replace(/</g, "\\u003c")

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializedSchema }}
    />
  )
}
