import { describe, it, expect } from "vitest";
import { findMatches, type HelpRequest } from "./store";
const req: HelpRequest = { id: "R", name: "x", category: "Shelter", description: "need a bed", location: "Northside", urgency: "Critical", status: "Pending", createdAt: "" };
describe("findMatches", () => {
  it("ranks same-category, same-area, available resource first", () => {
    expect(findMatches(req)[0].resource.name).toBe("Safe Haven Night Shelter");
  });
  it("returns at most 3 matches", () => { expect(findMatches(req).length).toBeLessThanOrEqual(3); });
});
