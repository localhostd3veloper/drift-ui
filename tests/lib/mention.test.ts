import { describe, expect, it } from "vitest"

import {
  filterMentionOptions,
  findActiveMention,
  insertMention,
} from "@/registry/default/lib/mention"

const PEOPLE = [
  { value: "noor", label: "Noor Haddad" },
  { value: "tomasz", label: "Tomasz Wierzba" },
]

describe("mention", () => {
  it("finds the mention being typed before the caret", () => {
    expect(findActiveMention("Thanks @no", 10, ["@"])).toEqual({
      trigger: "@",
      query: "no",
      start: 7,
    })
    expect(findActiveMention("@", 1, ["@"])).toEqual({
      trigger: "@",
      query: "",
      start: 0,
    })
  })

  it("ignores triggers inside words and unknown triggers", () => {
    expect(findActiveMention("mail me at ilse@example", 23, ["@"])).toBeNull()
    expect(findActiveMention("ping #ops", 9, ["@"])).toBeNull()
    expect(findActiveMention("@noor done", 10, ["@"])).toBeNull()
  })

  it("filters options by value or label", () => {
    expect(
      filterMentionOptions(PEOPLE, "wier").map((option) => option.value)
    ).toEqual(["tomasz"])
    expect(filterMentionOptions(PEOPLE, "")).toHaveLength(2)
  })

  it("replaces the query with the selected option and moves the caret", () => {
    const text = "cc @no and more"
    const mention = findActiveMention(text, 6, ["@"])!
    expect(insertMention(text, mention, 6, PEOPLE[0])).toEqual({
      text: "cc @noor  and more",
      caret: 9,
    })
  })
})
