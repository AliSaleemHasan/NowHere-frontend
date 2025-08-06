import Loading from "@/components/loading";
import { useSnap } from "@/features/snaps/context/snap-store";
import { handleCameraCapture } from "@/lib/image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import Gallery from "react-native-awesome-gallery";
export default function SnapsCapture() {
  // the idea is to make this page as 3 pages/ one for adding images, one for the form itself and the final one is for submitting the form

  const snaps = useSnap((state) => state.snaps);

  const [index, setIndex] = useState<number>(0);
  const [view, setView] = useState<
    "idle" | "canceled" | "captured" | "ongoing" | "error"
  >(snaps.length > 0 ? "captured" : "idle");

  const addSnap = useSnap((state) => state.addSnap);
  const deleteSnap = useSnap((state) => state.removeSnap);

  const handleCaptureImage = async (): Promise<void> => {
    setView("ongoing");
    try {
      const capture = await handleCameraCapture();

      if (capture.canceled) {
        setView("canceled");
        return;
      }

      const uri = capture?.assets?.[0].uri;
      if (uri) {
        addSnap(uri);
        setView("captured");
      }
    } catch {
      setView("error");
    }
  };

  const handleDeleteSnap = () => {
    deleteSnap(snaps[index]);

    if (snaps.length === 1) {
      setView("idle");
    }
  };

  useEffect(() => {
    if (view === "idle") handleCaptureImage();
  }, [view]);

  //TODO: handle error state globaly
  if ((view === "canceled" && snaps.length === 0) || view === "error")
    return <Redirect href={"/"} />;
  if (view === "ongoing") return <Loading></Loading>;
  else
    return (
      <View className="flex-1  ">
        <Gallery
          onIndexChange={(index) => setIndex(index)}
          loop
          data={snaps}
          disableVerticalSwipe
          renderItem={({ item }) => (
            <ImageBackground
              source={{ uri: item }}
              className="w-full h-[90%]"
            ></ImageBackground>
          )}
        ></Gallery>
        <View
          className={`flex-row   bg-white backdrop-blur-lg w-full h-[13%]  items-center rounded-lg  justify-between  gap-10`}
        >
          <TouchableOpacity
            onPress={handleDeleteSnap}
            className="flex-1   h-full  items-center justify-center"
          >
            <FontAwesome name="trash" size={25} color={"red"} />
          </TouchableOpacity>
          <Text className="text-sm">
            {index + 1} of {snaps.length}
          </Text>

          <TouchableOpacity
            onPress={handleCaptureImage}
            className="flex-1  items-center justify-center h-full "
          >
            <FontAwesome name="plus-circle" size={25} />
          </TouchableOpacity>
        </View>
      </View>
    );
}
