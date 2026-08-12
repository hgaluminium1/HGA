import { describe, expect, it } from "vitest";
import type { ApiSuccess } from "@/lib/types/api";

describe("ApiResponse shape", () => {
  it("success envelope matches architecture contract", () => {
    const payload: ApiSuccess<{ ok: boolean }> = {
      success: true,
      data: { ok: true },
    };
    expect(payload.success).toBe(true);
    expect(payload.data.ok).toBe(true);
  });
});
