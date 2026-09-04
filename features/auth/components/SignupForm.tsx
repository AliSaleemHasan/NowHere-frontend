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
import Toast from "react-native-toast-message";
import { useSignup } from "../hooks/use-auth-mutations";
import { signupSchema, type SignupFormData } from "../validation/signup-schema";
import { AuthRedirectPrompt } from "./AuthRedirectPrompt";

export const SignupForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const mutation = useSignup();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isLoading, isSubmitting },
  } = useForm<SignupFormData>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirm: "",
    },
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = (values: SignupFormData) => {
    Keyboard.dismiss();
    const data = {
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    };

    mutation.mutate(data, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: t("auth.signup.toastSuccessTitle"),
          text2: t("auth.signup.toastSuccessBody"),
        });
        router.replace("/");
      },
      onError: (err: unknown) => {
        Toast.show({
          type: "error",
          text1: t("auth.signup.toastErrorTitle"),
          text2: getErrorMessage(err, t("auth.signup.toastErrorFallback")),
        });
      },
    });
  };

  return (
    <View className="h-full w-full items-center justify-center gap-2">
      <Text className="text-center text-xl">{t("auth.signup.title")}</Text>
      <Text>{t("auth.signup.welcome")}</Text>

      <View className="h-2/3 w-5/6 gap-4">
        <Input
          control={control}
          name="email"
          placeholder={t("auth.signup.emailPlaceholder")}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        {errors.email?.message && (
          <FormError message={t(errors.email.message)} />
        )}
        <View className="w-full flex-row gap-3">
          <Input
            control={control}
            name="firstName"
            placeholder={t("auth.signup.firstNamePlaceholder")}
            className={`flex-1 ${errors.firstName ? "border-2 border-error" : ""}`}
          />
          <Input
            control={control}
            name="lastName"
            placeholder={t("auth.signup.lastNamePlaceholder")}
            className={`flex-1 ${errors.lastName ? "border-2 border-error" : ""}`}
          />
        </View>
        {errors.firstName?.message && (
          <FormError message={t(errors.firstName.message)} />
        )}
        {errors.lastName?.message && (
          <FormError message={t(errors.lastName.message)} />
        )}
        <Input
          control={control}
          name="password"
          placeholder={t("auth.signup.passwordPlaceholder")}
          secureTextEntry
          textContentType="password"
        />
        {errors.password?.message && (
          <FormError message={t(errors.password.message)} />
        )}
        <Input
          control={control}
          name="confirm"
          placeholder={t("auth.signup.confirmPasswordPlaceholder")}
          textContentType="password"
          secureTextEntry
        />
        {errors.confirm?.message && (
          <FormError message={t(errors.confirm.message)} />
        )}
        <FormButton
          onSubmit={handleSubmit(onSubmit)}
          text={t("auth.signup.submit")}
          isLoading={isLoading || isSubmitting || mutation.isPending}
          disabled={!isValid}
        />
        {mutation.isError && (
          <FormError
            message={getErrorMessage(
              mutation.error,
              t("auth.signup.toastErrorFallback"),
            )}
            errors={getApiValidationErrors(mutation.error)}
          />
        )}

        <AuthRedirectPrompt
          linkText={t("auth.signup.logIn")}
          promptText={t("auth.signup.haveAccount")}
          onPress={() => {
            router.replace("/login");
          }}
        />
      </View>
    </View>
  );
};
