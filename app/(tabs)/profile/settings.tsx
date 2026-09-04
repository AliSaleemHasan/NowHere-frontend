import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { SettingsChoiceRow } from "@/components/SettingsChoiceRow";
import { updateUserSettings } from "@/features/users/api/update-settings";
import { userQueryKeys } from "@/features/users/api/user-query";
import { useUserSettings } from "@/features/users/api/useUserSettings";
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
import { getApiValidationErrors, getErrorMessage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

function SettingsForm({ settings }: { settings: UserSetting }) {
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
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="p-5 pb-10"
    >
      <Text className="text-2xl font-semibold text-primary">
        {t("users.settings.title")}
      </Text>
      <Text className="mt-2 text-sm leading-5 text-gray-500">
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
    </ScrollView>
  );
}

export default function Settings() {
  const { t } = useTranslation();
  const query = useUserSettings();

  if (query.isLoading) {
    return <Loading cause={t("users.settings.loading")} />;
  }

  if (query.isError || !query.data) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
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

  return <SettingsForm settings={query.data} />;
}
