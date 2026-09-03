import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { useAuth } from "@/features/auth/context/auth-store";
import { confirmLogout } from "@/features/auth/components/LogoutButton";
import { useUser } from "@/features/users/api/useUser";
import ProfileImage from "@/features/users/components/ProfileImage";
import { patchUser, useUserStore } from "@/features/users/context/user-store";
import { formatUserDisplayName } from "@/types/api";
import { getErrorMessage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export const ErrorBoundary = NowHereError;

export default function Profile() {
  const router = useRouter();
  const logout = useAuth((state) => state.logout);
  const storedUser = useUserStore((state) => state.user);
  const userId = storedUser?.id;

  const userInfo = useUser(userId);

  useEffect(() => {
    const payload = userInfo.data;
    if (!payload?.user) return;
    patchUser({
      ...payload.user,
      userImage: payload.userImage || payload.user.image,
    });
  }, [userInfo.data]);

  if (!userId) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Text className="text-center text-base font-semibold text-primary">
          Session not found
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          Please sign in again to view your profile.
        </Text>
      </View>
    );
  }

  if (userInfo.isLoading && !storedUser) return <Loading />;

  const profileData = userInfo.data;
  const user = profileData?.user ?? storedUser;
  const profileImageUrl =
    profileData?.userImage || user?.userImage || user?.image;
  const name = formatUserDisplayName(user, "NowHere explorer");
  const settingUp = userInfo.isFetching && !user?.firstName;

  const onLogout = () => confirmLogout(logout);

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="pb-10"
    >
      <View className="bg-primary px-6 pb-16 pt-10">
        <Text className="text-xs uppercase tracking-widest text-white/70">
          Your profile
        </Text>
        <Text className="mt-1 text-2xl font-semibold text-white">{name}</Text>
      </View>

      <View className="-mt-12 items-center px-5">
        <View className="w-full items-center rounded-3xl bg-white px-5 pb-6 pt-4 shadow-sm">
          <ProfileImage image={profileImageUrl} userId={userId} size={120} />

          {settingUp ? (
            <Text className="mt-4 text-sm text-gray-500">
              Finishing your profile…
            </Text>
          ) : (
            <>
              <Text className="mt-4 text-xl font-semibold text-primary">
                {name}
              </Text>
              <Text className="mt-1 text-sm text-gray-500">{user?.email}</Text>
            </>
          )}

          {user?.role ? (
            <View className="mt-3 rounded-full bg-gray-100 px-3 py-1">
              <Text className="text-xs font-medium uppercase tracking-wide text-gray-600">
                {user.role === "ADMIN" ? "Admin" : "Member"}
              </Text>
            </View>
          ) : null}

          {user?.bio ? (
            <Text className="mt-4 text-center text-sm leading-5 text-gray-600">
              {user.bio}
            </Text>
          ) : (
            <Text className="mt-4 text-center text-sm text-gray-400">
              Share what’s around you — snaps nearby, just for now.
            </Text>
          )}
        </View>

        {userInfo.isError ? (
          <Text className="mt-4 text-center text-xs text-error">
            {getErrorMessage(userInfo.error, "Could not refresh profile")}
          </Text>
        ) : null}

        <View className="mt-5 w-full overflow-hidden rounded-3xl bg-white shadow-sm">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile/settings")}
            className="flex-row items-center justify-between px-5 py-4"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Ionicons name="options-outline" size={18} color="#0f0d23" />
              </View>
              <View>
                <Text className="text-base font-medium text-primary">
                  Visibility settings
                </Text>
                <Text className="text-xs text-gray-500">
                  Radius, posting distance, lifetime
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View className="h-px bg-gray-100" />

          <TouchableOpacity
            onPress={onLogout}
            className="flex-row items-center justify-between px-5 py-4"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-red-50">
                <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              </View>
              <Text className="text-base font-medium text-error">Log out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
