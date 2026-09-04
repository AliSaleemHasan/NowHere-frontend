import FormButton from "@/components/FormButton";
import { getErrorMessage } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { Share, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { exportAccount } from "../api/export-user";

export function ExportAccountSection({
  extra,
}: {
  extra?: Record<string, unknown>;
}) {
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: exportAccount,
  });

  const onExport = () => {
    mutation.mutate(undefined, {
      onSuccess: async (data) => {
        try {
          const result = await Share.share({
            title: t("users.settings.exportShareTitle"),
            message: JSON.stringify(
              extra ? { ...data, ...extra } : data,
              null,
              2,
            ),
          });
          if (result.action === Share.sharedAction) {
            Toast.show({
              type: "success",
              text1: t("users.settings.exportSuccessTitle"),
            });
          }
        } catch {
          Toast.show({
            type: "error",
            text1: t("users.settings.exportErrorTitle"),
            text2: t("users.settings.exportErrorFallback"),
          });
        }
      },
      onError: (err: unknown) => {
        Toast.show({
          type: "error",
          text1: t("users.settings.exportErrorTitle"),
          text2: getErrorMessage(
            err,
            t("users.settings.exportErrorFallback"),
          ),
        });
      },
    });
  };

  return (
    <View className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
      <Text className="text-base font-semibold text-primary">
        {t("users.settings.exportTitle")}
      </Text>
      <Text className="mt-1 text-sm leading-5 text-gray-500">
        {t("users.settings.exportDescription")}
      </Text>
      <View className="mt-4">
        <FormButton
          testID="export-account"
          onSubmit={onExport}
          text={t("users.settings.exportButton")}
          isLoading={mutation.isPending}
        />
      </View>
    </View>
  );
}
