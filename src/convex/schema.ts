import { Track } from "@/engine/types";

export interface TrackDoc extends Track {
  _id?: string;
  _creationTime?: number;
  createdAt: number;
  updatedAt: number;
  isStarter?: boolean;
}
