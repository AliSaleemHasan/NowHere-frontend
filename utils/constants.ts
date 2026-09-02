import { UserSetting } from "@/features/users/types/users-api-type";

export enum Tags {
  PROOMOTION = "PROOMOTION",
  INTERESTING = "INTERESTING",
  FINDINGS = "FINDINGS",
  LOST = "LOST",
  HIDDEN_GEM = "HIDDEN_GEM",
  SOCIAL = "SOCIAL",
}

export const TagsColors: { [key in keyof typeof Tags]: string } = {
  FINDINGS: "red",
  HIDDEN_GEM: "cyan",
  INTERESTING: "skyblue",
  LOST: "purple",
  PROOMOTION: "green",
  SOCIAL: "black",
};

export type APIS = "users" | "snaps" | "storage" | "auth";

export const getApiURL = (api?: APIS) => {
  const base = process.env.EXPO_PUBLIC_GATEWAY_URL;
  return api ? `${base}/${api}` : base || "";
};

export const userUISettings: {
  [k in keyof UserSetting]: {
    title: string;
    description: string;
    in: string;
  };
} = {
  maxDistance: {
    title: "User Max Visibility Distance",
    description:
      "The distance where user cannot see snaps after depending on location",
    in: "Meters",
  },
  newSnapDistance: {
    title: "Allowed range to post new snap",
    description: "The minimum distance for the previous post of the user",
    in: "Meters",
  },
  snapDisappearTime: {
    title: "Visibility expiration time (Days)",
    description: "Number of days the snaps will be visible in users location",
    in: "Days",
  },
};
