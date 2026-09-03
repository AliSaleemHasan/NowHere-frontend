export type UserSetting = {
  id?: string;
  maxDistance: number;
  newSnapDistance: number;
  snapDisappearTime: number;
};

export const userSettingsCopy: {
  [K in keyof Omit<UserSetting, "id">]: {
    title: string;
    description: string;
    icon: "eye" | "navigate" | "time";
    format: "meters" | "days";
  };
} = {
  maxDistance: {
    title: "Visibility radius",
    description: "How far around you nearby snaps can appear on the map.",
    icon: "eye",
    format: "meters",
  },
  newSnapDistance: {
    title: "Posting distance",
    description:
      "How far you need to move before you can share another snap in a new area.",
    icon: "navigate",
    format: "meters",
  },
  snapDisappearTime: {
    title: "Snap lifetime",
    description: "How long a snap stays visible to people nearby.",
    icon: "time",
    format: "days",
  },
};

export function formatMeters(meters: number): string {
  if (meters >= 1000 && meters % 1000 === 0) {
    return `${meters / 1000} km`;
  }
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
}

export function formatDays(days: number): string {
  return days === 1 ? "1 day" : `${days} days`;
}
