import { getConnectors, rotateDirection } from "@/engine/tileConnectivity";

describe("tileConnectivity", () => {
  it("rotates directions correctly", () => {
    expect(rotateDirection("N", 90)).toBe("E");
    expect(rotateDirection("E", 90)).toBe("S");
    expect(rotateDirection("S", 180)).toBe("N");
    expect(rotateDirection("W", 270)).toBe("S");
  });

  it("rotates tile connectors correctly", () => {
    expect(getConnectors({ type: "corner", rot: 0 })).toEqual(["N", "E"]);
    expect(getConnectors({ type: "corner", rot: 90 })).toEqual(["E", "S"]);
    expect(getConnectors({ type: "straight", rot: 90 })).toEqual(["S", "N"]);
    expect(getConnectors({ type: "tee", rot: 180 })).toEqual(["S", "W", "E"]);
  });

  it("lets goal accept all directions", () => {
    expect(getConnectors({ type: "goal", rot: 0 }).sort()).toEqual(["E", "N", "S", "W"]);
    expect(getConnectors({ type: "goal", rot: 90 }).sort()).toEqual(["E", "N", "S", "W"]);
  });
});
