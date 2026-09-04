import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import { getApiValidationErrors } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { deleteAccount } from "../api/delete-account";
import { getDeleteAccountErrorMessage } from "../get-delete-error-message";

type DeleteAccountForm = {
  password: string;
};

export function DeleteAccountSection({
  onDeleted,
}: {
  onDeleted: () => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const { control, watch, handleSubmit } = useForm<DeleteAccountForm>({
    defaultValues: { password: "" },
    mode: "onChange",
  });
  const password = watch("password");
  const mutation = useMutation({
    mutationFn: (value: string) => deleteAccount(value),
  });

  const incompleteMessage = t("users.settings.deleteIncomplete");
  const fallbackMessage = t("users.settings.deleteErrorFallback");
  const canSubmit = password.trim().length > 0 && !mutation.isPending;

  const runDelete = (values: DeleteAccountForm) => {
    mutation.mutate(values.password, {
      onSuccess: async () => {
        Toast.show({
          type: "success",
          text1: t("users.settings.deleteSuccessTitle"),
        });
        await onDeleted();
      },
      onError: (err: unknown) => {
        Toast.show({
          type: "error",
          text1: t("users.settings.deleteErrorTitle"),
          text2: getDeleteAccountErrorMessage(
            err,
            incompleteMessage,
            fallbackMessage,
          ),
        });
      },
    });
  };

  const onPressDelete = handleSubmit((values) => {
    Alert.alert(
      t("users.settings.deleteConfirmTitle"),
      t("users.settings.deleteConfirmBody"),
      [
        { text: t("users.settings.deleteCancel"), style: "cancel" },
        {
          text: t("users.settings.deleteConfirmAction"),
          style: "destructive",
          onPress: () => runDelete(values),
        },
      ],
    );
  });

  return (
    <View className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
      <Text className="text-base font-semibold text-error">
        {t("users.settings.deleteTitle")}
      </Text>
      <Text className="mt-1 text-sm leading-5 text-gray-500">
        {t("users.settings.deleteDescription")}
      </Text>
      <View className="mt-4 gap-3">
        <Input
          testID="delete-account-password"
          control={control}
          name="password"
          placeholder={t("users.settings.deletePasswordPlaceholder")}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
        />
        <FormButton
          testID="delete-account-submit"
          onSubmit={onPressDelete}
          disabled={!canSubmit}
          text={t("users.settings.deleteButton")}
          isLoading={mutation.isPending}
        />
        {mutation.error ? (
          <FormError
            message={getDeleteAccountErrorMessage(
              mutation.error,
              incompleteMessage,
              fallbackMessage,
            )}
            errors={getApiValidationErrors(mutation.error)}
          />
        ) : null}
      </View>
    </View>
  );
}
