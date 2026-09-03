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
import { useSignup } from "../hooks/use-auth-mutations";
import { AuthRedirectPrompt } from "./AuthRedirectPrompt";

const SignUpSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "One lowercase letter is required")
      .regex(/[A-Z]/, "One uppercase letter is required")
      .regex(/\d/, "One number is required")
      .regex(/[^A-Za-z0-9]/, "One symbol is required"),
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
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirm: "",
    },
    resolver: zodResolver(SignUpSchema),
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

    mutation.mutate(data,
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Welcome to NowHere!",
            text2: "Your account has been created.",
          });
          router.replace("/");
        },
        onError: (err: unknown) => {
          Toast.show({
            type: "error",
            text1: "Sign up failed",
            text2: getErrorMessage(
              err,
              "Please check the form and try again.",
            ),
          });
        },
      },
    );
  };

  return (
    <View className="h-full w-full items-center justify-center gap-2">
      <Text className="text-center text-xl">Sign up</Text>
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
        <View className="w-full flex-row gap-3">
          <Input
            control={control}
            name="firstName"
            placeholder="First Name.."
            className={`flex-1 ${errors.firstName ? "border-2 border-error" : ""}`}
          />
          <Input
            control={control}
            name="lastName"
            placeholder="Last Name.."
            className={`flex-1 ${errors.lastName ? "border-2 border-error" : ""}`}
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
          <FormError message={errors.password.message} />
        )}
        <Input
          control={control}
          name="confirm"
          placeholder="Confirm Password.."
          textContentType="password"
          secureTextEntry
        />
        {errors.confirm?.message && (
          <FormError message={errors.confirm.message} />
        )}
        <FormButton
          onSubmit={handleSubmit(onSubmit)}
          text="Signup"
          isLoading={isLoading || isSubmitting || mutation.isPending}
          disabled={!isValid}
        />
        {mutation.isError && (
          <FormError
            message={getErrorMessage(mutation.error)}
            errors={getApiValidationErrors(mutation.error)}
          />
        )}

        <AuthRedirectPrompt
          linkText="Log in"
          promptText="Have an Account!"
          onPress={() => {
            router.replace("/login");
          }}
        />
      </View>
    </View>
  );
};
