import FromButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { useSignup } from "../hooks/use-signup";
import { AuthRedirectPrompt } from "./AuthRedirectPrompt";
import SocialNetworksAuth from "./SocialNetworkAuth";

const SignUpSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "One lowercase letter is required")
      .regex(/[A-Z]/, "One uppercase letter is required")
      .regex(/\d/, "One number is required")
      .regex(/\W/, "One symbol is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type SignupFormData = z.infer<typeof SignUpSchema>;

export const SignupForm = () => {
  const router = useRouter();
  const mutation = useSignup();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isLoading, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
  });

  const onSubmit = (values: SignupFormData) => {
    const { confirm, ...data } = values;
    const username =
      `${data.firstName} ${data.lastName}`.trim() || data.email;
    Keyboard.dismiss();

    mutation.mutate(
      { ...data, username },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Welcome to NowHere!",
            text2: "Your account has been created.",
          });
          router.replace("/");
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: "Sign up failed",
            text2: err?.message || "Please check the form and try again.",
          });
        },
      },
    );
  };

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
            name="firstName"
            placeholder="First Name.."
            className={`flex-1  ${errors.firstName && "border-2 border-error"}`}
          />
          <Input
            control={control}
            name="lastName"
            placeholder="Last Name.."
            className={`flex-1 ${errors.lastName && "border-2 border-error"}`}
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
          isLoading={isLoading || isSubmitting}
          disabled={!isValid}
        ></FromButton>
        {mutation.isError && (
          <FormError
            message={mutation.error.message}
            errors={(mutation.error as any)?.problemDetails?.errors}
          />
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
