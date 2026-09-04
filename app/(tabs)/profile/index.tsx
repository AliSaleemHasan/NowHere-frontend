import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { SafeAreaView, SafeScreen } from "@/components/SafeScreen";
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
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export const ErrorBoundary = NowHereError;

function ProfileMenuRow({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  onPress,
  danger,
  testID,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  testID?: string;
}) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      className="flex-row items-center justify-between px-5 py-4"
    >
      <View className="flex-row items-center gap-3">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
        >
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        {subtitle ? (
          <View>
            <Text className="text-base font-medium text-primary">{title}</Text>
            <Text className="text-xs text-gray-500">{subtitle}</Text>
          </View>
        ) : (
          <Text
            className={`text-base font-medium ${danger ? "text-error" : "text-primary"}`}
          >
            {title}
          </Text>
        )}
      </View>
      {danger ? null : (
        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
}

export default function Profile() {
  const { t } = useTranslation();
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
      <SafeScreen className="items-center justify-center bg-gray-50 p-6">
        <Text className="text-center text-base font-semibold text-primary">
          {t("users.profile.sessionMissingTitle")}
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          {t("users.profile.sessionMissingBody")}
        </Text>
      </SafeScreen>
    );
  }

  if (userInfo.isLoading && !storedUser) return <Loading />;

  const profileData = userInfo.data;
  const user = profileData?.user ?? storedUser;
  const profileImageUrl =
    profileData?.userImage || user?.userImage || user?.image;
  const name = formatUserDisplayName(user, t("users.profile.fallbackName"));
  const settingUp = userInfo.isFetching && !user?.firstName;

  const onLogout = () => confirmLogout(logout);

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView edges={["top"]} className="bg-primary" />
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerClassName="pb-10"
      >
        <View className="bg-primary px-5 pb-16 pt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs uppercase tracking-widest text-white/70">
              {t("users.profile.yourProfile")}
            </Text>
            <TouchableOpacity
              testID="profile-settings"
              accessibilityRole="button"
              accessibilityLabel={t("users.profile.settingsTitle")}
              hitSlop={12}
              onPress={() => router.push("/(tabs)/profile/settings")}
              className="h-10 w-10 items-center justify-center"
            >
              <Ionicons name="settings-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-2xl font-semibold text-white">{name}</Text>
        </View>

      <View className="-mt-12 items-center px-5">
        <View className="w-full items-center rounded-3xl bg-white px-5 pb-6 pt-4 shadow-sm">
          <ProfileImage image={profileImageUrl} userId={userId} size={120} />

          {settingUp ? (
            <Text className="mt-4 text-sm text-gray-500">
              {t("users.profile.finishing")}
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
                {user.role === "ADMIN"
                  ? t("users.profile.roleAdmin")
                  : t("users.profile.roleMember")}
              </Text>
            </View>
          ) : null}

          {user?.bio ? (
            <Text className="mt-4 text-center text-sm leading-5 text-gray-600">
              {user.bio}
            </Text>
          ) : (
            <Text className="mt-4 text-center text-sm text-gray-400">
              {t("users.profile.emptyBio")}
            </Text>
          )}
        </View>

        {userInfo.isError ? (
          <Text className="mt-4 text-center text-xs text-error">
            {getErrorMessage(userInfo.error, t("users.profile.refreshError"))}
          </Text>
        ) : null}

        <View className="mt-5 w-full overflow-hidden rounded-3xl bg-white shadow-sm">
          <ProfileMenuRow
            icon="create-outline"
            iconBg="bg-gray-100"
            iconColor="#0f0d23"
            title={t("users.profile.editTitle")}
            subtitle={t("users.profile.editSubtitle")}
            onPress={() => router.push("/(tabs)/profile/edit")}
          />
          <View className="h-px bg-gray-100" />
          <ProfileMenuRow
            testID="profile-my-snaps"
            icon="images-outline"
            iconBg="bg-gray-100"
            iconColor="#0f0d23"
            title={t("snaps.mySnaps.title")}
            subtitle={t("profile.mySnapsSubtitle")}
            onPress={() => router.push("/(tabs)/profile/my-snaps")}
          />
          <View className="h-px bg-gray-100" />
          <ProfileMenuRow
            testID="profile-saved"
            icon="bookmark-outline"
            iconBg="bg-gray-100"
            iconColor="#0f0d23"
            title={t("snaps.saved.title")}
            subtitle={t("profile.savedSubtitle")}
            onPress={() => router.push("/(tabs)/profile/saved")}
          />
          <View className="h-px bg-gray-100" />
          <ProfileMenuRow
            icon="options-outline"
            iconBg="bg-gray-100"
            iconColor="#0f0d23"
            title={t("users.profile.settingsTitle")}
            subtitle={t("users.profile.settingsSubtitle")}
            onPress={() => router.push("/(tabs)/profile/settings")}
          />
          <View className="h-px bg-gray-100" />
          <ProfileMenuRow
            icon="key-outline"
            iconBg="bg-gray-100"
            iconColor="#0f0d23"
            title={t("users.profile.passwordTitle")}
            subtitle={t("users.profile.passwordSubtitle")}
            onPress={() => router.push("/(tabs)/profile/change-password")}
          />
          <View className="h-px bg-gray-100" />
          <ProfileMenuRow
            icon="log-out-outline"
            iconBg="bg-red-50"
            iconColor="#ef4444"
            title={t("users.profile.logout")}
            onPress={onLogout}
            danger
          />
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
