import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import { getApiValidationErrors } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, Text, View } from "react-native";
import { getResetErrorMessage } from "../get-reset-error-message";
import { useResetPassword } from "../hooks/use-auth-mutations";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../validation/reset-password-schema";
import { AuthRedirectPrompt } from "./AuthRedirectPrompt";

function readTokenParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0]?.trim() ?? "";
  return value?.trim() ?? "";
}

export const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const token = readTokenParam(params.token);
  const mutation = useResetPassword();

  const {
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    control,
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      newPassword: "",
      confirm: "",
    },
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const invalidMessage = t("auth.reset.invalidToken");
  const fallbackMessage = t("auth.reset.toastErrorFallback");

  const onSubmit = (values: ResetPasswordFormData) => {
    Keyboard.dismiss();
    mutation.mutate({ token, newPassword: values.newPassword });
  };

  if (!token) {
    return (
      <View className="h-full w-full items-center justify-center gap-4 px-6">
        <Text className="text-center text-xl">{t("auth.reset.title")}</Text>
        <Text className="text-center text-sm leading-5 text-gray-600">
          {invalidMessage}
        </Text>
        <AuthRedirectPrompt
          linkText={t("auth.reset.backToLogin")}
          promptText={t("auth.reset.haveAccount")}
          onPress={() => {
            router.replace("/login");
          }}
        />
      </View>
    );
  }

  if (mutation.isSuccess) {
    return (
      <View className="h-full w-full items-center justify-center gap-4 px-6">
        <Text className="text-center text-xl">
          {t("auth.reset.successTitle")}
        </Text>
        <Text className="text-center text-sm leading-5 text-gray-600">
          {t("auth.reset.successBody")}
        </Text>
        <AuthRedirectPrompt
          linkText={t("auth.reset.backToLogin")}
          promptText={t("auth.reset.haveAccount")}
          onPress={() => {
            router.replace("/login");
          }}
        />
      </View>
    );
  }

  return (
    <View className="h-full w-full items-center justify-center gap-4">
      <Text className="text-center text-xl">{t("auth.reset.title")}</Text>
      <Text className="px-8 text-center text-sm leading-5 text-gray-600">
        {t("auth.reset.intro")}
      </Text>

      <View className="h-2/3 w-5/6 gap-4">
        <Input
          control={control}
          name="newPassword"
          placeholder={t("auth.reset.newPlaceholder")}
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
          placeholder={t("auth.reset.confirmPlaceholder")}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
        />
        {errors.confirm?.message ? (
          <FormError message={t(errors.confirm.message)} />
        ) : null}
        <FormButton
          testID="reset-submit"
          onSubmit={handleSubmit(onSubmit)}
          disabled={!isValid}
          text={t("auth.reset.submit")}
          isLoading={isSubmitting || mutation.isPending}
        />
        {mutation.error ? (
          <FormError
            message={getResetErrorMessage(
              mutation.error,
              invalidMessage,
              fallbackMessage,
            )}
            errors={getApiValidationErrors(mutation.error)}
          />
        ) : null}
        <AuthRedirectPrompt
          linkText={t("auth.reset.backToLogin")}
          promptText={t("auth.reset.haveAccount")}
          onPress={() => {
            router.replace("/login");
          }}
        />
      </View>
    </View>
  );
};
