import { SignaturePad } from "@/registry/default/ui/signature-pad"

const SAVED_SIGNATURE = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200"><g fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M120 140Q150 60 180 110Q210 160 240 90Q270 40 300 120Q330 160 380 110Q420 70 460 115"/></g></svg>`

export function SignaturePadSavedPreview() {
  return (
    <SignaturePad
      aria-label="Saved signature"
      defaultValue={SAVED_SIGNATURE}
      className="max-w-md"
    />
  )
}
