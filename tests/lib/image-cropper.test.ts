import { describe, expect, it } from "vitest"

import {
  canvasToBlob,
  clampCrop,
  computeCropSize,
  computeInitialRenderSize,
  computePixelCrop,
  getBoundaries,
  getRotatedSize,
} from "@/registry/default/lib/image-cropper"

describe("image-cropper pure logic", () => {
  describe("computeCropSize", () => {
    it("calculates square crop dimensions within container", () => {
      const size = computeCropSize(400, 300, 1)
      expect(size.width).toBe(size.height)
      expect(size.height).toBeLessThanOrEqual(300 * 0.85)
    })

    it("calculates 16:9 widescreen crop dimensions", () => {
      const size = computeCropSize(800, 600, 16 / 9)
      const ratio = size.width / size.height
      expect(Math.abs(ratio - 16 / 9)).toBeLessThan(0.02)
      expect(size.width).toBeLessThanOrEqual(800 * 0.85)
    })

    it("returns maximum available area when aspect is not provided", () => {
      const size = computeCropSize(500, 400, null)
      expect(size.width).toBe(Math.round(500 * 0.85))
      expect(size.height).toBe(Math.round(400 * 0.85))
    })
  })

  describe("computeInitialRenderSize", () => {
    it("scales wide image to match crop box height", () => {
      const natural = { width: 800, height: 400 } // 2:1
      const crop = { width: 200, height: 200 } // 1:1
      const render = computeInitialRenderSize(natural, crop)
      expect(render.height).toBe(200)
      expect(render.width).toBe(400)
    })

    it("scales tall image to match crop box width", () => {
      const natural = { width: 300, height: 600 } // 1:2
      const crop = { width: 200, height: 200 } // 1:1
      const render = computeInitialRenderSize(natural, crop)
      expect(render.width).toBe(200)
      expect(render.height).toBe(400)
    })
  })

  describe("getRotatedSize", () => {
    it("keeps dimensions at 0 and 180 degrees", () => {
      const base = { width: 200, height: 100 }
      const deg0 = getRotatedSize(base, 0)
      expect(deg0.width).toBeCloseTo(200)
      expect(deg0.height).toBeCloseTo(100)

      const deg180 = getRotatedSize(base, 180)
      expect(deg180.width).toBeCloseTo(200)
      expect(deg180.height).toBeCloseTo(100)
    })

    it("swaps dimensions at 90 and 270 degrees", () => {
      const base = { width: 200, height: 100 }
      const deg90 = getRotatedSize(base, 90)
      expect(deg90.width).toBeCloseTo(100)
      expect(deg90.height).toBeCloseTo(200)

      const deg270 = getRotatedSize(base, 270)
      expect(deg270.width).toBeCloseTo(100)
      expect(deg270.height).toBeCloseTo(200)
    })
  })

  describe("getBoundaries & clampCrop", () => {
    it("disallows panning when rendered image matches crop size exactly", () => {
      const { maxPanX, maxPanY } = getBoundaries(
        { width: 200, height: 200 },
        { width: 200, height: 200 },
        1,
        0
      )
      expect(maxPanX).toBe(0)
      expect(maxPanY).toBe(0)

      const clamped = clampCrop(
        { x: 50, y: -50 },
        { width: 200, height: 200 },
        { width: 200, height: 200 },
        1,
        0
      )
      expect(clamped).toEqual({ x: 0, y: 0 })
    })

    it("allows panning proportional to zoom scale", () => {
      const { maxPanX, maxPanY } = getBoundaries(
        { width: 200, height: 200 },
        { width: 200, height: 200 },
        2,
        0
      )
      // 200 * 2 = 400. (400 - 200) / 2 = 100
      expect(maxPanX).toBe(100)
      expect(maxPanY).toBe(100)

      const clamped = clampCrop(
        { x: 150, y: -80 },
        { width: 200, height: 200 },
        { width: 200, height: 200 },
        2,
        0
      )
      expect(clamped).toEqual({ x: 100, y: -80 })
    })
  })

  describe("computePixelCrop", () => {
    it("computes exact centered crop coordinates in natural pixels", () => {
      const pixelCrop = computePixelCrop(
        { x: 0, y: 0 },
        { width: 400, height: 300 },
        { width: 200, height: 200 },
        { width: 800, height: 600 },
        1,
        0
      )

      expect(pixelCrop).toEqual({
        x: 200,
        y: 100,
        width: 400,
        height: 400,
      })
    })

    it("adjusts pixel coordinates when zoomed in", () => {
      const pixelCrop = computePixelCrop(
        { x: 0, y: 0 },
        { width: 400, height: 300 },
        { width: 200, height: 200 },
        { width: 800, height: 600 },
        2,
        0
      )

      expect(pixelCrop).toEqual({
        x: 300,
        y: 200,
        width: 200,
        height: 200,
      })
    })

    it("shifts crop coordinates when panned", () => {
      const pixelCrop = computePixelCrop(
        { x: -50, y: 0 },
        { width: 400, height: 300 },
        { width: 200, height: 200 },
        { width: 800, height: 600 },
        1,
        0
      )

      // Panning -50 on viewport with scale 2 shifts natural x by +100
      expect(pixelCrop.x).toBe(300)
      expect(pixelCrop.y).toBe(100)
    })
  })

  describe("canvasToBlob", () => {
    it("resolves to a Blob with specified MIME type", async () => {
      const canvas = document.createElement("canvas")
      canvas.width = 50
      canvas.height = 50

      const blob = await canvasToBlob(canvas, "image/png")
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe("image/png")
    })
  })
})
