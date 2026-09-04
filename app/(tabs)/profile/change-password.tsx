import AvoidKeyboard from "@/components/AvoidKeyboard";
import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import NowHereError from "@/components/Nowhere-Error";
import {
  changePasswordSchema,
  type ChangePasswordForm,
} from "@/features/auth/validation/change-password-schema";
import { changePassword } from "@/features/users/api/change-password";
import { getApiValidationErrors, getErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export const ErrorBoundary = NowHereError;

export default function ChangePassword() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirm: "",
    },
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordForm) =>
      changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
  });

  const onSubmit = (values: ChangePasswordForm) => {
    Keyboard.dismiss();
    mutation.mutate(values, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: t("users.password.toastSuccessTitle"),
          text2: t("users.password.toastSuccessBody"),
        });
        router.back();
      },
      onError: (err: unknown) => {
        Toast.show({
          type: "error",
          text1: t("users.password.toastErrorTitle"),
          text2: getErrorMessage(
            err,
            t("users.password.toastErrorFallback"),
          ),
        });
      },
    });
  };

  return (
    <AvoidKeyboard>
      <View className="flex-1 bg-gray-50 px-5 py-6">
        <Text className="text-2xl font-semibold text-primary">
          {t("users.password.title")}
        </Text>
        <View className="mt-5 gap-4">
          <Input
            control={control}
            name="currentPassword"
            placeholder={t("users.password.currentPlaceholder")}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
          />
          {errors.currentPassword?.message ? (
            <FormError message={t(errors.currentPassword.message)} />
          ) : null}
          <Input
            control={control}
            name="newPassword"
            placeholder={t("users.password.newPlaceholder")}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />
          {errors.newPassword?.message ? (
            <FormError message={t(errors.newPassword.message)} />
          ) : null}
          <Input
            control={control}
            name="confirm"
            placeholder={t("users.password.confirmPlaceholder")}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />
          {errors.confirm?.message ? (
            <FormError message={t(errors.confirm.message)} />
          ) : null}
          <FormButton
            onSubmit={handleSubmit(onSubmit)}
            disabled={!isValid}
            text={t("users.password.submit")}
            isLoading={isSubmitting || mutation.isPending}
          />
          {mutation.error ? (
            <FormError
              message={getErrorMessage(
                mutation.error,
                t("users.password.toastErrorFallback"),
              )}
              errors={getApiValidationErrors(mutation.error)}
            />
          ) : null}
        </View>
      </View>
    </AvoidKeyboard>
  );
}
