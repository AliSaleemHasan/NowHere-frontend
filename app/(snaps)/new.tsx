import AvoidKeyboard from "@/components/avoid-keyboard";
import { useAuth } from "@/features/auth/context/auth-store";
import AddSnapForm from "@/features/snaps/components/add-snap-form";
import FormSnapsGallery from "@/features/snaps/components/form-snaps-gallery";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddSnap() {
  const { isLoggedIn } = useAuth();

  // the idea is to make this page as 3 pages/ one for adding images, one for the form itself and the final one is for submitting the form

  return (
    <SafeAreaView className="h-full  relative  ">
      {/* first page : handling image addition */}
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
