import AvoidKeyboard from "@/components/avoid-keyboard";
import { useAuth } from "@/features/auth/context/auth-store";
import AddSnapForm from "@/features/snaps/components/add-snap-form";
import FormSnapsGallery from "@/features/snaps/components/form-snaps-gallery";
import { Redirect } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddSnap() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn)
    return (
      <Redirect
        href={{ pathname: "/(auth)/login", params: { origin: "/add-snap" } }}
      />
    );

  return (
    <SafeAreaView className="h-full  relative  ">
      <AvoidKeyboard>
        <FormSnapsGallery />
        <AddSnapForm />
      </AvoidKeyboard>
    </SafeAreaView>
  );
}

// <Text className="">Add your snap/s</Text>

//     <View className="gap-4">
//       <TextInput
//         multiline
//         placeholder="Description"

//         numberOfLines={10}
//         className="border p-2 h-fit"
//         returnKeyType="next"
//       ></TextInput>
//     </View>
