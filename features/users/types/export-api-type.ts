import type { UserSetting } from "./users-api-type";

export type UserExport = {
  exportedAt: string;
  user: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    image?: string;
  };
  settings: UserSetting | null;
  snaps: unknown[];
  seen: unknown[];
  bookmarks: unknown[];
  reports: unknown[];
};
