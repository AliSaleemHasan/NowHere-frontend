import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthRedirectPrompt } from "./auth-redirect-prompt";
import SocialNetworksAuth from "./social-network-auth";
export const LoginForm = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="rounded-tl-md h-full   gap-4 w-full  items-center justify-center   ">
      <Text className="text-center  text-xl "> Signin </Text>
      <Text>Welcome To NowHere</Text>

      <View className="flex gap-4   h-2/3 w-5/6 ">
        <TextInput
          placeholder="Email.."
          keyboardType={"email-address"}
          className="p-2 py-4 shadow-sm bg-white  rounded-lg"
        ></TextInput>
        <TextInput
          placeholder="Password.."
          keyboardType={"visible-password"}
          className="p-2 py-4 shadow-sm bg-white  rounded-lg"
        ></TextInput>
        <TouchableOpacity className="bg-primary   w-full">
          <Text className="text-center text-white p-3">Login</Text>
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
