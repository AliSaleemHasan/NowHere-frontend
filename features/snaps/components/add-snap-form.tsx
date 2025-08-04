import FromButton from "@/components/form-button";
import { Input } from "@/components/input";
import { fetchWithoutAuth } from "@/lib/fetch-api";
import { FontAwesome } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";
import { useSnap } from "../context/snap-store";

interface Props {
  disabled?: boolean;
}

const AddSnapSchema = z.object({
  description: z.string(),
  snaps: z.array(z.string()).max(2).min(1),
});

type AddSnapData = z.infer<typeof AddSnapSchema>;

export default function AddSnapForm(props: Props) {
  const addSnap = useSnap((state) => state.addSnap);
  const { control } = useForm<AddSnapData>({
    resolver: zodResolver(AddSnapSchema),
  });

  const addImageMutation = useMutation({
    mutationFn: (file: FormData) => {
      return fetchWithoutAuth({
        url: "snaps",
        options: {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      });
    },
  });

  const handlePickImage = async () => {
    await ImagePicker.requestCameraPermissionsAsync(); //TODO : make sure to handle if user does not accept the camera permission
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    addSnap(result.assets[0].uri);
  };
  return (
    <View className="flex-1   h-5/6 w-full rounded-t-3xl   ">
      {/* Add image */}
      <View className="absolute z-40 w-full ">
        <TouchableOpacity
          onPress={handlePickImage}
          disabled={props.disabled}
          className={`${props.disabled ? "bg-gray-500" : "bg-secondary"} w-32 h-32 rounded-full shadow-sm shadow-primary  items-center justify-center mx-auto translate-y-[-4rem]`}
        >
          <FontAwesome name="camera" size={40}></FontAwesome>
        </TouchableOpacity>
      </View>

      {/* Rest of the form */}

      <TouchableNativeFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <View className="flex-1 min-h-fit gap-3 mt-[5rem] px-3 ">
          <View>
            <Input
              control={control}
              name="description"
              className="w-full h-32"
              placeholder="Description"
              numberOfLines={10}
              multiline
              returnKeyType="next"
            ></Input>
          </View>
          <FromButton onSubmit={() => {}} text="Add"></FromButton>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}
