import { Input } from "@/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
import { useAuth } from "../context/auth-store";
import { AuthRedirectPrompt } from "./auth-redirect-prompt";
import SocialNetworksAuth from "./social-network-auth";
const LoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "One lowercase letter is required!")
    .regex(/[A-Z]/, "Onw uppercase letter is required")
    .regex(/\d/, "One number required!")
    .regex(/\W/, "One symbol required!"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

const router = useRouter();

export const LoginForm = () => {
  const login = useAuth((state) => state.login);

  const {
    formState: { isLoading },
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
    await login({ user: values });
  };
  return (
    <SafeAreaView className="rounded-tl-md h-full   gap-4 w-full  items-center justify-center   ">
      <Text className="text-center  text-xl "> Signin </Text>
      <Text>Welcome To NowHere</Text>

      <View className="flex gap-4   h-2/3 w-5/6 ">
        <Input
          control={control}
          name="email"
          placeholder="Email.."
          keyboardType={"email-address"}
        />
        <Input
          placeholder="Password.."
          name="password"
          control={control}
          keyboardType={"visible-password"}
        />
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-primary   w-full items-center justify-center flex"
        >
          {isLoading ? (
            <ActivityIndicator size={20} color={"primary"} />
          ) : (
            <Text className="text-center text-white p-3">Login</Text>
          )}
        </TouchableOpacity>
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
