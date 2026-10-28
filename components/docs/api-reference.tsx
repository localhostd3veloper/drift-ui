import type { ApiPart } from "@/lib/agent-docs/component-api"

export function ApiReference({ parts }: { parts: ApiPart[] }) {
  return (
    <div className="flex flex-col gap-12">
      {parts.map((part) => (
        <div key={part.name} className="flex flex-col gap-3">
          <h3 className="font-mono text-sm font-medium">{part.name}</h3>
          {part.signature && (
            <code className="block overflow-x-auto rounded-lg border bg-muted/40 px-3 py-2 font-mono text-xs whitespace-pre text-foreground">
              {part.signature}
            </code>
          )}
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            {part.description}
          </p>
          {part.props && (
            <div className="mt-1 overflow-hidden rounded-xl border">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2.5 font-medium sm:w-[44%]"
                    >
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
                    <tr key={prop.name} className="align-top">
                      <th scope="row" className="px-4 py-3 font-normal">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <code className="font-mono text-[13px] text-foreground">
                            {prop.name}
                          </code>
                          {prop.required && (
                            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                              Required
                            </span>
                          )}
                        </span>
                        <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground sm:hidden">
                          <code className="break-words">{prop.type}</code>
                          {prop.default && (
                            <code className="break-words">
                              = {prop.default}
                            </code>
                          )}
                        </span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
                          {prop.description}
                        </span>
                      </th>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <code className="font-mono text-xs break-words text-muted-foreground">
                          {prop.type}
                        </code>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        {prop.default && (
                          <code className="font-mono text-xs break-words text-muted-foreground">
                            {prop.default}
                          </code>
                        )}
                      </td>
                    </tr>
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
      ))}
    </div>
  )
}
