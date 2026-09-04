import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import { getApiValidationErrors } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { getLoginErrorMessage } from "../get-login-error-message";
import { useLogin } from "../hooks/use-auth-mutations";
import {
  loginSchema,
  type LoginFormData,
} from "../validation/login-schema";
import { AuthFormShell } from "./AuthFormShell";
import { AuthRedirectPrompt } from "./AuthRedirectPrompt";

export const LoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const mutation = useLogin();

  const {
    formState: { isLoading, errors, isValid, isSubmitting },
    handleSubmit,
    control,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const lockoutMessage = t("auth.login.lockout");
  const fallbackMessage = t("auth.login.toastErrorFallback");

  const onSubmit = (values: LoginFormData) => {
    Keyboard.dismiss();
    mutation.mutate(values, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: t("auth.login.toastSuccessTitle"),
          text2: t("auth.login.toastSuccessBody"),
        });
        router.replace("/");
      },
      onError: (err: unknown) => {
        Toast.show({
          type: "error",
          text1: t("auth.login.toastErrorTitle"),
          text2: getLoginErrorMessage(err, lockoutMessage, fallbackMessage),
        });
      },
    });
  };

  return (
    <AuthFormShell
      title={t("auth.login.title")}
      subtitle={t("auth.login.welcome")}
    >
      <Input
        control={control}
        name="email"
        placeholder={t("auth.login.emailPlaceholder")}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      {errors.email?.message && (
        <FormError message={t(errors.email.message)} />
      )}
      <Input
        placeholder={t("auth.login.passwordPlaceholder")}
        name="password"
        control={control}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
      />
      {errors.password?.message && (
        <FormError message={t(errors.password.message)} />
      )}
      <TouchableOpacity
        onPress={() => {
          router.navigate("/forgot-password");
        }}
        className="self-end p-1"
      >
        <Text className="text-xs text-gray-600">{t("auth.login.forgot")}</Text>
      </TouchableOpacity>
      <FormButton
        onSubmit={handleSubmit(onSubmit)}
        disabled={!isValid}
        text={t("auth.login.submit")}
        isLoading={isLoading || isSubmitting || mutation.isPending}
      />

      {mutation.error && (
        <FormError
          message={getLoginErrorMessage(
            mutation.error,
            lockoutMessage,
            fallbackMessage,
          )}
          errors={getApiValidationErrors(mutation.error)}
        />
      )}

      <AuthRedirectPrompt
        linkText={t("auth.login.signUp")}
        promptText={t("auth.login.noAccount")}
        onPress={() => {
          router.navigate("/signup");
        }}
      />
    </AuthFormShell>
  );
};
