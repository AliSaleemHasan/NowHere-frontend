export const REFRESH_TOKEN_KEY = "OAPSEMAPCAWECOPN";
export const ACCESS_TOKEN_KEY = "APWIEFNFJNCPOC";
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

export type APIS = "users" | "snaps" | "storage";

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
    default:
      api_url = process.env.EXPO_PUBLIC_SNAPS_URL;
      break;
  }
  return api_url;
};
