import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import { getApiValidationErrors, getErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, Text, View } from "react-native";
import { useForgotPassword } from "../hooks/use-auth-mutations";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../validation/forgot-password-schema";
import { AuthRedirectPrompt } from "./AuthRedirectPrompt";

export const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const mutation = useForgotPassword();

  const {
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    control,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (values: ForgotPasswordFormData) => {
    Keyboard.dismiss();
    mutation.mutate(values);
  };

  if (mutation.isSuccess) {
    return (
      <View className="h-full w-full items-center justify-center gap-4 px-6">
        <Text className="text-center text-xl">
          {t("auth.forgot.successTitle")}
        </Text>
        <Text className="text-center text-sm leading-5 text-gray-600">
          {t("auth.forgot.successBody")}
        </Text>
        <AuthRedirectPrompt
          linkText={t("auth.forgot.backToLogin")}
          promptText={t("auth.forgot.haveAccount")}
          onPress={() => {
            router.replace("/login");
          }}
        />
      </View>
    );
  }

  return (
    <View className="h-full w-full items-center justify-center gap-4">
      <Text className="text-center text-xl">{t("auth.forgot.title")}</Text>
      <Text className="px-8 text-center text-sm leading-5 text-gray-600">
        {t("auth.forgot.intro")}
      </Text>

      <View className="h-2/3 w-5/6 gap-4">
        <Input
          control={control}
          name="email"
          placeholder={t("auth.forgot.emailPlaceholder")}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        {errors.email?.message ? (
          <FormError message={t(errors.email.message)} />
        ) : null}
        <FormButton
          testID="forgot-submit"
          onSubmit={handleSubmit(onSubmit)}
          disabled={!isValid}
          text={t("auth.forgot.submit")}
          isLoading={isSubmitting || mutation.isPending}
        />
        {mutation.error ? (
          <FormError
            message={getErrorMessage(
              mutation.error,
              t("auth.forgot.toastErrorFallback"),
            )}
            errors={getApiValidationErrors(mutation.error)}
          />
        ) : null}
        <AuthRedirectPrompt
          linkText={t("auth.forgot.backToLogin")}
          promptText={t("auth.forgot.haveAccount")}
          onPress={() => {
            router.replace("/login");
          }}
        />
      </View>
    </View>
  );
};
