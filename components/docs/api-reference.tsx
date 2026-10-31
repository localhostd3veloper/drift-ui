import { cn } from "@/registry/default/lib/utils"
import type { ApiPart, ApiProp } from "@/lib/agent-docs/component-api"
import { highlightInline, highlightType } from "@/lib/highlight"

function HighlightedCode({
  html,
  className,
}: {
  html: string
  className?: string
}) {
  return (
    <code
      dangerouslySetInnerHTML={{ __html: html }}
      className={cn("code-inline font-mono text-xs break-words", className)}
    />
  )
}

const DEFAULT_CHIP = "inline-block rounded bg-muted px-1.5 py-0.5"

async function PropRow({ prop }: { prop: ApiProp }) {
  const [type, fallback] = await Promise.all([
    highlightType(prop.type),
    prop.default && highlightInline(prop.default),
  ])

  return (
    <tr className="align-top transition-colors hover:bg-muted/30">
      <th scope="row" className="px-4 py-3 font-normal">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <code className="font-mono text-[13px] font-medium text-brand">
            {prop.name}
          </code>
          {prop.required && (
            <span className="rounded bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-brand uppercase">
              Required
            </span>
          )}
        </span>
        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 sm:hidden">
          <HighlightedCode html={type} />
          {fallback && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Default
              <HighlightedCode html={fallback} className={DEFAULT_CHIP} />
            </span>
          )}
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
          {prop.description}
        </span>
      </th>
      <td className="hidden px-4 py-3 sm:table-cell">
        <HighlightedCode html={type} />
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        {fallback && (
          <HighlightedCode html={fallback} className={DEFAULT_CHIP} />
        )}
      </td>
    </tr>
  )
}

async function ApiPartSection({ part }: { part: ApiPart }) {
  const signature = part.signature && (await highlightInline(part.signature))

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-mono text-sm font-medium">{part.name}</h3>
      {signature && (
        <code
          dangerouslySetInnerHTML={{ __html: signature }}
          className="code-inline block overflow-x-auto rounded-lg border bg-muted/40 px-3 py-2 font-mono text-xs whitespace-pre text-foreground"
        />
      )}
      <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
        {part.description}
      </p>
      {part.props && (
        <div className="mt-1 overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium sm:w-[44%]">
                  Prop
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-2.5 font-medium sm:table-cell"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="hidden w-[18%] px-4 py-2.5 font-medium sm:table-cell"
                >
                  Default
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {part.props.map((prop) => (
                <PropRow key={prop.name} prop={prop} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {part.rest && (
        <p className="text-xs text-muted-foreground">
          Other props go to the{" "}
          <code className="font-mono text-foreground">{part.rest}</code>.
        </p>
      )}
    </div>
  )
}

export function ApiReference({ parts }: { parts: ApiPart[] }) {
  return (
    <div className="flex flex-col gap-12">
      {parts.map((part) => (
        <ApiPartSection key={part.name} part={part} />
      ))}
    </div>
  )
}
