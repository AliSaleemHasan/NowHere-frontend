import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import NowHereError from "@/components/Nowhere-Error";
import { SettingsChoiceRow } from "@/components/SettingsChoiceRow";
import { useAuth } from "@/features/auth/context/auth-store";
import { useHiddenSnaps } from "@/features/snaps/context/hidden-snaps-store";
import { updateUserSettings } from "@/features/users/api/update-settings";
import { userQueryKeys } from "@/features/users/api/user-query";
import { useUserSettings } from "@/features/users/api/useUserSettings";
import { DeleteAccountSection } from "@/features/users/components/DeleteAccountSection";
import { ExportAccountSection } from "@/features/users/components/ExportAccountSection";
import {
  MAX_DISTANCE_PRESETS,
  NEW_SNAP_DISTANCE_PRESETS,
  SNAP_DISAPPEAR_TIME_PRESETS,
} from "@/features/users/settings-presets";
import type { UserSetting } from "@/features/users/types/users-api-type";
import {
  userSettingsSchema,
  type UserSettingsForm,
} from "@/features/users/validation/settings-schema";
import { useLocale, type AppLocale } from "@/lib/i18n";
import { cn, getApiValidationErrors, getErrorMessage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export const ErrorBoundary = NowHereError;

function formatDistance(meters: number, t: TFunction) {
  if (meters >= 1000 && meters % 1000 === 0) {
    return t("users.settings.km", { count: meters / 1000 });
  }
  return t("users.settings.meters", { count: meters });
}

function SettingsFieldIcon({
  name,
}: {
  name: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="h-11 w-11 items-center justify-center rounded-2xl bg-gray-100">
      <Ionicons name={name} size={20} color="#0f0d23" />
    </View>
  );
}

function toFormValues(settings: UserSetting): UserSettingsForm {
  const parsed = userSettingsSchema.safeParse({
    maxDistance: settings.maxDistance,
    newSnapDistance: settings.newSnapDistance,
    snapDisappearTime: settings.snapDisappearTime,
  });
  if (parsed.success) return parsed.data;
  return {
    maxDistance: settings.maxDistance as UserSettingsForm["maxDistance"],
    newSnapDistance:
      settings.newSnapDistance as UserSettingsForm["newSnapDistance"],
    snapDisappearTime:
      settings.snapDisappearTime as UserSettingsForm["snapDisappearTime"],
  };
}

function LanguageSection() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  return (
    <View className="rounded-3xl bg-white p-5 shadow-sm">
      <View className="flex-row items-start gap-3">
        <SettingsFieldIcon name="language-outline" />
        <View className="flex-1">
          <Text className="text-base font-semibold text-primary">
            {t("users.settings.languageTitle")}
          </Text>
          <Text className="mt-1 text-sm leading-5 text-gray-500">
            {t("users.settings.languageDescription")}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row flex-wrap gap-2">
        {(["en", "de"] as const satisfies readonly AppLocale[]).map(
          (option) => {
            const selected = locale === option;
            return (
              <TouchableOpacity
                key={option}
                testID={`locale-${option}`}
                onPress={() => {
                  void setLocale(option);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className={cn(
                  "rounded-full px-4 py-2",
                  selected ? "bg-primary" : "bg-gray-100",
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-medium",
                    selected ? "text-white" : "text-primary",
                  )}
                >
                  {option === "en"
                    ? t("users.settings.languageEn")
                    : t("users.settings.languageDe")}
                </Text>
              </TouchableOpacity>
            );
          },
        )}
      </View>
    </View>
  );
}

function PrivacyRow() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <TouchableOpacity
      testID="settings-privacy"
      onPress={() => router.push("/privacy")}
      className="mt-5 flex-row items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-sm"
    >
      <View className="flex-row items-center gap-3">
        <SettingsFieldIcon name="document-text-outline" />
        <View>
          <Text className="text-base font-semibold text-primary">
            {t("users.settings.privacyTitle")}
          </Text>
          <Text className="text-sm text-gray-500">
            {t("users.settings.privacySubtitle")}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
}

function VisibilityForm({ settings }: { settings: UserSetting }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<UserSettingsForm>({
    defaultValues: toFormValues(settings),
    resolver: zodResolver(userSettingsSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: updateUserSettings,
  });

  const onSubmit = (values: UserSettingsForm) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        queryClient.setQueryData(userQueryKeys.settings, data);
        queryClient.invalidateQueries({ queryKey: userQueryKeys.settings });
        reset(values);
        Toast.show({
          type: "success",
          text1: t("users.settings.toastSuccessTitle"),
        });
      },
      onError: (err: unknown) => {
        Toast.show({
          type: "error",
          text1: t("users.settings.toastErrorTitle"),
          text2: getErrorMessage(
            err,
            t("users.settings.toastErrorFallback"),
          ),
        });
      },
    });
  };

  const saving = isSubmitting || mutation.isPending;

  return (
    <View className="mt-5">
      <Text className="text-sm leading-5 text-gray-500">
        {t("users.settings.intro")}
      </Text>

      <View className="mt-5 gap-3">
        <Controller
          control={control}
          name="maxDistance"
          render={({ field: { value, onChange } }) => (
            <SettingsChoiceRow
              label={t("users.settings.maxDistance.title")}
              description={t("users.settings.maxDistance.description")}
              options={MAX_DISTANCE_PRESETS}
              value={value}
              onChange={onChange}
              formatOption={(meters) => formatDistance(meters, t)}
              icon={<SettingsFieldIcon name="eye-outline" />}
              disabled={saving}
            />
          )}
        />
        {errors.maxDistance?.message ? (
          <FormError message={t(errors.maxDistance.message)} />
        ) : null}

        <Controller
          control={control}
          name="newSnapDistance"
          render={({ field: { value, onChange } }) => (
            <SettingsChoiceRow
              label={t("users.settings.newSnapDistance.title")}
              description={t("users.settings.newSnapDistance.description")}
              options={NEW_SNAP_DISTANCE_PRESETS}
              value={value}
              onChange={onChange}
              formatOption={(meters) => formatDistance(meters, t)}
              icon={<SettingsFieldIcon name="navigate-outline" />}
              disabled={saving}
            />
          )}
        />
        {errors.newSnapDistance?.message ? (
          <FormError message={t(errors.newSnapDistance.message)} />
        ) : null}

        <Controller
          control={control}
          name="snapDisappearTime"
          render={({ field: { value, onChange } }) => (
            <SettingsChoiceRow
              label={t("users.settings.snapDisappearTime.title")}
              description={t("users.settings.snapDisappearTime.description")}
              options={SNAP_DISAPPEAR_TIME_PRESETS}
              value={value}
              onChange={onChange}
              formatOption={(days) =>
                t("users.settings.days", { count: days })
              }
              icon={<SettingsFieldIcon name="time-outline" />}
              disabled={saving}
            />
          )}
        />
        {errors.snapDisappearTime?.message ? (
          <FormError message={t(errors.snapDisappearTime.message)} />
        ) : null}
      </View>

      <View className="mt-6">
        <FormButton
          onSubmit={handleSubmit(onSubmit)}
          disabled={!isValid || !isDirty}
          text={t("users.settings.save")}
          isLoading={saving}
        />
      </View>

      {mutation.error ? (
        <FormError
          message={getErrorMessage(
            mutation.error,
            t("users.settings.toastErrorFallback"),
          )}
          errors={getApiValidationErrors(mutation.error)}
        />
      ) : null}
    </View>
  );
}

function VisibilityBlock() {
  const { t } = useTranslation();
  const query = useUserSettings();

  if (query.isLoading) {
    return (
      <View className="mt-5 items-center py-8">
        <ActivityIndicator size={28} color="#0f0d23" />
        <Text className="mt-3 text-xs text-gray-600">
          {t("users.settings.loading")}
        </Text>
      </View>
    );
  }

  if (query.isError || !query.data) {
    return (
      <View className="mt-5 items-center rounded-3xl bg-white px-6 py-8 shadow-sm">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Ionicons name="cloud-offline-outline" size={24} color="#ef4444" />
        </View>
        <Text className="mt-4 text-center text-base font-semibold text-primary">
          {t("users.settings.notReadyTitle")}
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
          {getErrorMessage(query.error, t("users.settings.notReadyFallback"))}
        </Text>
        <TouchableOpacity
          onPress={() => query.refetch()}
          className="mt-6 rounded-full bg-primary px-5 py-3"
        >
          <Text className="font-semibold text-white">
            {t("users.settings.tryAgain")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <VisibilityForm settings={query.data} />;
}

export default function Settings() {
  const { t } = useTranslation();
  const logout = useAuth((state) => state.logout);
  const queryClient = useQueryClient();
  const hiddenSnapIds = useHiddenSnaps((state) => state.hiddenSnapIds);

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="p-5 pb-10"
    >
      <Text className="text-2xl font-semibold text-primary">
        {t("users.settings.title")}
      </Text>
      <View className="mt-5">
        <LanguageSection />
      </View>
      <VisibilityBlock />
      <PrivacyRow />
      <ExportAccountSection extra={{ hiddenSnapIds }} />
      <DeleteAccountSection
        onDeleted={async () => {
          queryClient.clear();
          await logout();
        }}
      />
    </ScrollView>
  );
}
