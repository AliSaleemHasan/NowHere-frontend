import AvoidKeyboard from "@/components/avoid-keyboard";
import { useAuth } from "@/features/auth/context/auth-store";
import AddSnapForm from "@/features/snaps/components/add-snap-form";
import FormSnapsGallery from "@/features/snaps/components/form-snaps-gallery";
import { useSnap } from "@/features/snaps/context/snap-store";
import * as ImagePicker from "expo-image-picker";
import { Redirect } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddSnap() {
  const snaps = useSnap((state) => state.snaps);

  const { isLoggedIn } = useAuth();

  if (!isLoggedIn)
    return (
      <Redirect
        href={{ pathname: "/(auth)/login", params: { origin: "/add-snap" } }}
      />
    );

  const handleSubmitImage = async () => {
    const cameraPer = await ImagePicker.requestCameraPermissionsAsync();
    let results = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,

      aspect: [4, 3],
      quality: 1,
    });
    if (results.canceled) return;

    const payload = new FormData();
    payload.append("files", {
      uri: results.assets[0].uri,
      name: results.assets[0].uri.split("/").pop(),
      type: `image/${results.assets[0].uri.split(".").pop()}`,
    } as any);

    addImageMutation.mutate(payload);
  };

  return (
    <SafeAreaView className="h-full  relative  ">
      <AvoidKeyboard>
        <FormSnapsGallery />
        <AddSnapForm disabled={snaps.length === 2} />
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
