// Single source of truth for campaign copy and numbers. Swap these values for
// the real campaign; the UI and the fly-through waypoints read from here.

export const campaign = {
  churchName: "St. Maryam Church",
  campaignName: "Building Our Future Together",
  city: "Columbus, Ohio",
  goal: 2_500_000,
  raised: 1_640_000,
  donors: 812,
  currency: "USD",
} as const;

export type WaypointId = "hero" | "vision" | "need" | "impact" | "give";

// Each waypoint is a scroll section. `at` is the normalized position (0–1)
// along the fly-through where the camera should be framing that part of the
// church. The background renderer uses these as keyframe anchors.
export const waypoints: { id: WaypointId; label: string; at: number }[] = [
  { id: "hero", label: "Exterior approach", at: 0 },
  { id: "vision", label: "Through the doors", at: 0.25 },
  { id: "need", label: "Over the sanctuary", at: 0.5 },
  { id: "impact", label: "Community hall", at: 0.75 },
  { id: "give", label: "Rising above the city", at: 1 },
];
