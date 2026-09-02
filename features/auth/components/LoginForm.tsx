import FromButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Keyboard, SafeAreaView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { useLogin } from "../hooks/use-login";
import { AuthRedirectPrompt } from "./AuthRedirectPrompt";
import SocialNetworksAuth from "./SocialNetworkAuth";

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

  const onSubmit = async (values: LoginFormData) => {
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
      onError: (err: any) => {
        Toast.show({
          type: "error",
          text1: "Sign in failed",
          text2: err?.message || "Please check your email and password.",
        });
      },
    });
  };

  return (
    <SafeAreaView className="rounded-tl-md h-full   gap-4 w-full  items-center justify-center   ">
      <Text className="text-center  text-xl "> Signin </Text>
      <Text>Welcome To NowHere</Text>

      <View className="flex gap-4   h-2/3 w-5/6 ">
        <Input control={control} name="email" placeholder="Email.." />
        <Input
          placeholder="Password.."
          name="password"
          control={control}
          secureTextEntry
        />
        <FromButton
          onSubmit={handleSubmit(onSubmit)}
          disabled={!isValid}
          text="Login"
          isLoading={isLoading || isSubmitting}
        ></FromButton>

        {mutation.error && (
          <FormError
            message={mutation.error.message}
            errors={(mutation.error as any)?.problemDetails?.errors}
          />
        )}
        <Text className="text-gray-600 text-xs font-thin text-center">
          Forgot Password?
        </Text>

        <AuthRedirectPrompt
          linkText="Sign up"
          promptText="Don't have an Account"
          onPress={() => {
            router.navigate("/signup");
          }}
        />

        {/* Social networks auth section */}
        <SocialNetworksAuth />
      </View>
    </SafeAreaView>
  );
};
