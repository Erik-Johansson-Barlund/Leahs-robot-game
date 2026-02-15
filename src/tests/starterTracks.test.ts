import { validateTrack } from "@/engine/validateTrack";
import { starterTracks } from "@/lib/starterTracks";

describe("starter tracks", () => {
  it("all starter tracks are valid", () => {
    starterTracks.forEach((track) => {
      const result = validateTrack(track.tiles, track.width, track.height);
      expect(result.isValid).toBe(true);
    });
  });
});
