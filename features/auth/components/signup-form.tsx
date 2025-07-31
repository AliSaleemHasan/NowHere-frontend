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
export const SignupForm = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="rounded-tl-md h-full   gap-4 w-full  items-center justify-center   ">
      <Text className="text-center  text-xl "> Signup </Text>
      <Text>Welcome To NowHere</Text>

      <View className="flex gap-4   h-2/3 w-5/6 ">
        <TextInput
          placeholder="Email.."
          keyboardType={"email-address"}
          className="p-2 py-4 shadow-sm bg-white  rounded-lg"
        ></TextInput>
        <View className="flex-row gap-3">
          <TextInput
            placeholder="First Name.."
            className="p-2 py-4 shadow-sm bg-white  rounded-lg flex-1"
          ></TextInput>
          <TextInput
            placeholder="Last Name.."
            className="p-2 py-4 shadow-sm bg-white  rounded-lg flex-1"
          ></TextInput>
        </View>
        <TextInput
          placeholder="Password.."
          keyboardType={"visible-password"}
          textContentType="password"
          className="p-2 py-4 shadow-sm bg-white  rounded-lg"
        ></TextInput>
        <TextInput
          placeholder="Confirm Password.."
          textContentType="password"
          keyboardType={"visible-password"}
          className="p-2 py-4 shadow-sm bg-white  rounded-lg"
        ></TextInput>
        <TouchableOpacity className="bg-primary   w-full">
          <Text className="text-center text-white p-3">Signup</Text>
        </TouchableOpacity>

        <AuthRedirectPrompt
          linkText="Log in"
          promptText="Have an Account!"
          onPress={() => {
            router.push("/login");
          }}
        />

        {/* Social networks auth section */}
        <SocialNetworksAuth />
      </View>
    </SafeAreaView>
  );
};
