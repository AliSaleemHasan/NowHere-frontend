import { Tags } from "@/utils";

export interface SnapLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface SnapFile {
  uri: string;
  name: string;
  type: string;
}
export interface CreateSnapBody {
  _userId: string;
  snaps: SnapFile[];
  description: string;
  location: SnapLocation;
}

export type CreateSnapResponse = Omit<CreateSnapBody, "snaps"> & {
  snaps: string[];
  createdAt: string;
  updatedAt: string;
  tag: Tags;
  _id: string;
};

export type FindSnapResponse = CreateSnapResponse;
