export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
  errors?: string[];
  code?: string;
}

export type HeaderContentType = "json" | "files" | "text" | "html";

export type UserRole = "USER" | "ADMIN";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthIdentity = {
  id: string;
  email: string;
  role: UserRole;
};

export type AuthUser = AuthIdentity & {
  isActive: boolean;
  lastLoginAt?: string | null;
};

export type UserProfile = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: string;
  userImage?: string;
  role?: UserRole;
  isActive?: boolean;
  lastLoginAt?: string | null;
};

export type GetUserResponse = {
  user: UserProfile;
  userImage: string;
};

export type UpdateUserImageResponse = GetUserResponse;

export function formatUserDisplayName(
  user?: Pick<UserProfile, "firstName" | "lastName" | "email"> | null,
  fallback = "Anonymous",
): string {
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  return name || user?.email || fallback;
}
