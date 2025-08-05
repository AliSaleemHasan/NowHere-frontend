import { useSnap } from "@/features/snaps/context/snap-store";
import { FontAwesome } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import * as ImagePicker from "expo-image-picker";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Gallery from "react-native-awesome-gallery";
export default function AddSnap() {
  // the idea is to make this page as 3 pages/ one for adding images, one for the form itself and the final one is for submitting the form

  const headerHeight = useHeaderHeight();

  const snaps = useSnap((state) => state.snaps);

  const [index, setIndex] = useState<number>(0);
  const [cameraStatus, setCameraStatus] = useState<
    "canceled" | "initial" | "open"
  >(snaps.length > 0 ? "open" : "initial");

  const addSnap = useSnap((state) => state.addSnap);
  const deleteSnap = useSnap((state) => state.removeSnap);

  const handleCaptureImage = async (): Promise<void> => {
    const capture = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      allowsMultipleSelection: true,
      mediaTypes: ["livePhotos"],
      quality: 1,
    });

    setCameraStatus(capture.canceled ? "canceled" : "open");

    if (capture?.assets?.[0].uri) addSnap(capture.assets[0].uri);
  };
  useEffect(() => {
    if (cameraStatus === "initial") handleCaptureImage();
  }, [cameraStatus]);

  if (cameraStatus === "canceled" && snaps.length === 0)
    return <Redirect href={"/"} />;
  else if (cameraStatus === "initial")
    // it happend before openning the camera
    return (
      <View className="h-full  relative bg-black items-center justify-center ">
        {/* first page : handling image addition */}
        <ActivityIndicator size={50} color={"white"} />
      </View>
    );
  // camera was open and a picture was taken
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
            onPress={() => deleteSnap(snaps[index])}
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

//

//  <AvoidKeyboard>
//       <FormSnapsGallery />
//       <AddSnapForm />
//     </AvoidKeyboard>
