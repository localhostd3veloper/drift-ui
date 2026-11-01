import { describe, expect, it } from "vitest"

import {
  applyMask,
  calculateCurrencyCaretPosition,
  calculateMaskCaretPosition,
  formatCurrency,
  getCurrencyInfo,
  parseCurrency,
  unmaskValue,
} from "@/registry/default/lib/masked-input"

describe("masked-input logic", () => {
  describe("applyMask and unmaskValue", () => {
    it("formats and unmasks credit card numbers", () => {
      const mask = "#### #### #### ####"
      const { formatted, raw } = applyMask("1234567812345678", mask)
      expect(formatted).toBe("1234 5678 1234 5678")
      expect(raw).toBe("1234567812345678")
      expect(unmaskValue(formatted, mask)).toBe("1234567812345678")
    })

    it("appends delimiters when group is complete", () => {
      const mask = "#### #### #### ####"
      expect(applyMask("1234", mask).formatted).toBe("1234 ")
      expect(applyMask("12345", mask).formatted).toBe("1234 5")
    })

    it("formats and unmasks phone numbers with leading literals", () => {
      const mask = "(###) ###-####"
      expect(applyMask("1", mask).formatted).toBe("(1")
      expect(applyMask("123", mask).formatted).toBe("(123) ")
      expect(applyMask("1234567890", mask).formatted).toBe("(123) 456-7890")
      expect(unmaskValue("(123) 456-7890", mask)).toBe("1234567890")
    })

    it("handles alphanumeric tokens", () => {
      const mask = "AA-####-AA"
      expect(applyMask("AB1234CD", mask).formatted).toBe("AB-1234-CD")
      expect(unmaskValue("AB-1234-CD", mask)).toBe("AB1234CD")
    })

    it("handles empty values gracefully", () => {
      expect(applyMask("", "####").formatted).toBe("")
      expect(unmaskValue("", "####")).toBe("")
    })
  })

  describe("calculateMaskCaretPosition", () => {
    const mask = "#### #### ####"

    it("places caret after inserted character and skips trailing delimiter", () => {
      // User has "123", types "4" -> formatted "1234 "
      const pos = calculateMaskCaretPosition({
        nextFormatted: "1234 ",
        rawInput: "1234",
        rawCursorPos: 4,
        mask,
      })
      expect(pos).toBe(5) // After "1234 "
    })

    it("keeps caret in place when inserting in the middle", () => {
      // User has "124 5678", cursor was at 2 (after "12"), typed "3" -> "123 4567 8"
      const pos = calculateMaskCaretPosition({
        nextFormatted: "1234 5678",
        rawInput: "1234 5678",
        rawCursorPos: 3,
        mask,
      })
      expect(pos).toBe(3)
    })

    it("adjusts caret position when deleting in the middle", () => {
      // User had "1234 5678", deleted "3" -> "1245 678"
      const pos = calculateMaskCaretPosition({
        nextFormatted: "1245 678",
        rawInput: "124 5678",
        rawCursorPos: 2,
        mask,
      })
      expect(pos).toBe(2)
    })
  })

  describe("currency logic", () => {
    it("retrieves currency info for different locales", () => {
      const usd = getCurrencyInfo("en-US", "USD")
      expect(usd.fractionDigits).toBe(2)
      expect(usd.decimal).toBe(".")
      expect(usd.group).toBe(",")

      const eur = getCurrencyInfo("de-DE", "EUR")
      expect(eur.fractionDigits).toBe(2)
      expect(eur.decimal).toBe(",")
      expect(eur.group).toBe(".")

      const jpy = getCurrencyInfo("ja-JP", "JPY")
      expect(jpy.fractionDigits).toBe(0)
    })

    it("formats cents into localized currency", () => {
      expect(formatCurrency(1250, "en-US", "USD")).toBe("$12.50")
      // normalize non-breaking spaces in currency format
      const deFormatted = formatCurrency(1250, "de-DE", "EUR").replace(
        /\u00a0/g,
        " "
      )
      expect(deFormatted).toBe("12,50 €")

      expect(formatCurrency(1250, "ja-JP", "JPY")).toBe("￥1,250")
      expect(formatCurrency(null, "en-US", "USD")).toBe("")
    })

    it("parses currency strings into cents", () => {
      expect(parseCurrency("$12.50", "en-US", "USD")).toBe(1250)
      expect(parseCurrency("12,50 €", "de-DE", "EUR")).toBe(1250)
      expect(parseCurrency("1.250,50 €", "de-DE", "EUR")).toBe(125050)
      expect(parseCurrency("¥1,250", "ja-JP", "JPY")).toBe(1250)
      expect(parseCurrency("", "en-US", "USD")).toBeNull()
    })

    it("calculates caret position during currency formatting shifts", () => {
      // Typing 4 after 1 in "$1,250.00" -> "$14,250.00"
      const pos = calculateCurrencyCaretPosition({
        nextFormatted: "$14,250.00",
        rawInput: "$14,250.00",
        rawCursorPos: 3,
      })
      expect(pos).toBe(3) // Right after '4'

      // Typing '.' after "$12" -> "$12."
      const dotPos = calculateCurrencyCaretPosition({
        nextFormatted: "$12.",
        rawInput: "$12.",
        rawCursorPos: 4,
      })
      expect(dotPos).toBe(4) // Right after '.'

      // Typing '5' after '.' -> "$12.5"
      const fracPos = calculateCurrencyCaretPosition({
        nextFormatted: "$12.5",
        rawInput: "$12.5",
        rawCursorPos: 5,
      })
      expect(fracPos).toBe(5) // Right after '5'
    })
  })
})
