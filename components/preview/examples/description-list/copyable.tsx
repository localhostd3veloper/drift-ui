import {
  DescriptionItem,
  DescriptionList,
} from "@/registry/default/ui/description-list"

export function DescriptionListCopyablePreview() {
  return (
    <DescriptionList className="w-full max-w-md">
      <DescriptionItem label="Project ID" copyable>
        <span className="font-mono">prj_41kd92</span>
      </DescriptionItem>
      <DescriptionItem label="Public key" copyable>
        <span className="font-mono">pk_live_7f3a</span>
      </DescriptionItem>
      <DescriptionItem label="Region">eu-west-1</DescriptionItem>
    </DescriptionList>
  )
}
