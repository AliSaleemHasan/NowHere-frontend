import EmptyState from "@/components/EmptyState";
import { SafeScreen } from "@/components/SafeScreen";
import { useAuth } from "@/features/auth/context/auth-store";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AddSnap() {
  const { t } = useTranslation();
  const router = useRouter();
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  return (
    <SafeScreen className="items-center justify-center bg-gray-50 px-8">
      <EmptyState
        tone="brand"
        icon="camera"
        title={t("snaps.add.title")}
        body={t("snaps.add.body")}
        actionLabel={!isLoggedIn ? t("snaps.add.signIn") : undefined}
        onAction={
          !isLoggedIn ? () => router.push("/(auth)/login") : undefined
        }
      />
    </SafeScreen>
  );
}
