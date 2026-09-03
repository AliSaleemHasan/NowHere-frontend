import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import { getApiValidationErrors, getErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Keyboard, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { useLogin } from "../hooks/use-auth-mutations";
import { AuthRedirectPrompt } from "./AuthRedirectPrompt";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
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
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = (values: LoginFormData) => {
    Keyboard.dismiss();
    mutation.mutate(values, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Signed in successfully",
          text2: "Welcome back!",
        });
        router.replace("/");
      },
      onError: (err: unknown) => {
        Toast.show({
          type: "error",
          text1: "Sign in failed",
          text2: getErrorMessage(
            err,
            "Please check your email and password.",
          ),
        });
      },
    });
  };

  return (
    <View className="h-full w-full items-center justify-center gap-4">
      <Text className="text-center text-xl">Sign in</Text>
      <Text>Welcome To NowHere</Text>

      <View className="h-2/3 w-5/6 gap-4">
        <Input
          control={control}
          name="email"
          placeholder="Email.."
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        {errors.email?.message && (
          <FormError message={errors.email.message} />
        )}
        <Input
          placeholder="Password.."
          name="password"
          control={control}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
        />
        {errors.password?.message && (
          <FormError message={errors.password.message} />
        )}
        <FormButton
          onSubmit={handleSubmit(onSubmit)}
          disabled={!isValid}
          text="Login"
          isLoading={isLoading || isSubmitting || mutation.isPending}
        />

        {mutation.error && (
          <FormError
            message={getErrorMessage(mutation.error)}
            errors={getApiValidationErrors(mutation.error)}
          />
        )}

        <AuthRedirectPrompt
          linkText="Sign up"
          promptText="Don't have an Account"
          onPress={() => {
            router.navigate("/signup");
          }}
        />
      </View>
    </View>
  );
};
