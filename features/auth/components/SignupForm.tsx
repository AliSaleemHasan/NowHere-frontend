import FromButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import { apiFetch } from "@/lib/fetch-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import * as z from "zod";
import { AuthRedirectPrompt } from "./AuthRedirectPrompt";
import SocialNetworksAuth from "./SocialNetworkAuth";
const SignUpSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "One lowercase letter is required!")
      .regex(/[A-Z]/, "Onw uppercase letter is required")
      .regex(/\d/, "One number required!")
      .regex(/\W/, "One symbol required!"),
    first_name: z.string(),
    last_name: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type SignupFormData = z.Infer<typeof SignUpSchema>;

export const SignupForm = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: { user: Omit<SignupFormData, "confirm"> }) => {
      return apiFetch({
        url: "auth/signup",
        options: {
          method: "POST",
          body: JSON.stringify(data),
        },
      });
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isLoading },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
  });

  const onSubmit = (values: SignupFormData) => {
    const { confirm, ...data } = values;
    Keyboard.dismiss();
    mutation.mutate(
      { user: data },
      {
        onSuccess: () => router.replace("/(auth)/login"), // TODO: push back to verification email
      }
    );
  };

  useEffect(() => {
    mutation.error;
  }, [mutation.error]);

  return (
    <KeyboardAvoidingView
      className="rounded-tl-md h-full   gap-2 w-full  items-center justify-center"
      behavior={Platform.select({ ios: "padding", android: "height" })}
      keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
    >
      <Text className="text-center  text-xl "> Signup </Text>
      <Text>Welcome To NowHere</Text>

      <View className="flex gap-4   h-2/3 w-5/6 ">
        <Input
          control={control}
          name="email"
          placeholder="Email.."
          keyboardType={"email-address"}
        />
        {errors.email?.message && (
          <FormError message={errors.email?.message}></FormError>
        )}
        <View className="flex-row gap-3 w-full ">
          <Input
            control={control}
            name="first_name"
            placeholder="First Name.."
            className={`flex-1  ${errors.first_name && "border-2 border-error"}`}
          />
          <Input
            control={control}
            name="last_name"
            placeholder="Last Name.."
            className={`flex-1 ${errors.last_name && "border-2 border-error"}`}
          />
        </View>
        <Input
          control={control}
          name="password"
          placeholder="Password.."
          secureTextEntry
          textContentType="password"
        />
        {errors.password?.message && (
          <FormError message={errors.password.message}></FormError>
        )}
        <Input
          control={control}
          name="confirm"
          placeholder="Confirm Password.."
          textContentType="password"
          secureTextEntry
        />
        {errors.confirm?.message && (
          <FormError message={errors.confirm.message}></FormError>
        )}
        <FromButton
          onSubmit={handleSubmit(onSubmit)}
          text="Signup"
          isLoading={isLoading}
          disabled={!isValid}
        ></FromButton>
        {mutation.isError && (
          <FormError message={mutation.error.message}></FormError>
        )}

        <AuthRedirectPrompt
          linkText="Log in"
          promptText="Have an Account!"
          onPress={() => {
            router.replace("/login");
          }}
        />

        {/* Social networks auth section */}
        <SocialNetworksAuth />
      </View>
    </KeyboardAvoidingView>
  );
};
