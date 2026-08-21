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
  let api_url: string | undefined = "";

  switch (api) {
    case "users":
      api_url = process.env.EXPO_PUBLIC_USERS_URL;
      break;

    case "snaps":
      api_url = process.env.EXPO_PUBLIC_SNAPS_URL;
      break;

    case "storage":
      api_url = process.env.EXPO_PUBLIC_STORAGE_URL;
      break;
    case "auth":
      api_url = process.env.EXPO_PUBLIC_AUTH_URL;
      break;
    default:
      api_url = process.env.EXPO_PUBLIC_SNAPS_URL;
      break;
  }
  return api_url;
};

export const userUISettings: {
  [k in keyof UserSetting]: {
    title: string;
    description: string;
    in: string;
  };
} = {
  max_distance: {
    title: "User Max Visibility Distance ",
    description:
      "The distance were that user cannot say snaps after depending on location",
    in: "Meters",
  },
  new_snap_distance: {
    title: "Allowed range to post new snap ",
    description: "The minimmum distance for the previous post of the user",
    in: "Meters",
  },
  snapDisappearTime: {
    title: "Visibility expiration time (Days)",
    description: "Number of days the snaps will be visible in users locaiton",
    in: "Days",
  },
};
