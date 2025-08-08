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
  locaiton: SnapLocation;
}
