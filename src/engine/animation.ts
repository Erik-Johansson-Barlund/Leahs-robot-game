import { Frame } from "./types";

export interface AnimatedFrame extends Frame {
  atMs: number;
}

export function toAnimatedFrames(frames: Frame[], stepMs = 450): AnimatedFrame[] {
  return frames.map((frame, index) => ({
    ...frame,
    atMs: index * stepMs
  }));
}

export function getPlaybackDuration(frames: Frame[], stepMs = 450): number {
  if (frames.length === 0) {
    return 0;
  }
  return (frames.length - 1) * stepMs;
}
