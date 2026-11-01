import { SignaturePad } from "@/registry/default/ui/signature-pad"

export function SignaturePadPenColorPreview() {
  return (
    <SignaturePad
      aria-label="Approval signature"
      penColor="var(--primary)"
      className="max-w-md"
    />
  )
}
