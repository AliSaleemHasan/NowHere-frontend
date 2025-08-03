import FromButton from "@/components/form-button";
import FormError from "@/components/form-error";
import { Input } from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Keyboard, SafeAreaView, Text, View } from "react-native";
import * as z from "zod";
import { useAuth } from "../context/auth-store";
import { AuthRedirectPrompt } from "./auth-redirect-prompt";
import SocialNetworksAuth from "./social-network-auth";
const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

type LoginFormData = z.infer<typeof LoginSchema>;

const router = useRouter();

export const LoginForm = () => {
  const login = useAuth((state) => state.login);
  const mutation = useMutation({ mutationFn: login });

  const {
    formState: { isLoading, errors, isValid },
    handleSubmit,
    control,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: LoginFormData) => {
    Keyboard.dismiss();
    mutation.mutate(
      { user: values },
      {
        onSuccess: () => router.replace("/"),
      }
    );
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
          text="Login"
          isLoading={isLoading}
        ></FromButton>

        {mutation.error && <FormError message={mutation.error.message} />}
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
