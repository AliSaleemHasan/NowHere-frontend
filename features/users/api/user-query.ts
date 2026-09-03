export const userQueryKeys = {
  detail: (userId: string | undefined) => ["user", userId] as const,
  settings: ["users", "settings"] as const,
};
