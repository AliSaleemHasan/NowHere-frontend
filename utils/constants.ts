export const REFRESH_TOKEN_KEY = "OAPSEMAPCAWECOPN";
export const ACCESS_TOKEN_KEY = "APWIEFNFJNCPOC";
export const API_URL = "http://192.168.1.69:3000";
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
  HIDDEN_GEM: "cayan",
  INTERESTING: "skyblue",
  LOST: "purple",
  PROOMOTION: "green",
  SOCIAL: "black",
};
