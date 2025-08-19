import FromButton from "@/components/FormButton";
import { apiAuthFetch } from "@/lib/fetch-api";
import { handleCameraCapture } from "@/lib/image-picker";
import { API_URL } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  userId?: string;
  image?: string;
}
export default function ProfileImage({ userId, image }: Props) {
  const queryClient = useQueryClient();
  const [expandImage, setExpandImage] = useState<boolean>(false);

  const updateImageMutation = useMutation({
    mutationFn: async (data: FormData) =>
      await apiAuthFetch({
        url: "users/image",
        options: {
          method: "PUT",
          body: data,
        },
      }),
  });

  const handleChangeImage = async () => {
    const capture = await handleCameraCapture();
    if (capture.canceled || !capture.assets[0]) return;

    let photo = capture.assets[0].uri;
    const payload = new FormData();
    payload.set("photo", {
      uri: photo,
      name: photo.split("/").pop() || crypto.randomUUID(),
      type: `image/${photo.split(".").pop()}`,
    } as any);

    updateImageMutation.mutate(payload, {
      onSuccess: (data) => {
        queryClient.setQueryData(["profile", userId], data);
      },
      onError: (err) => Toast.show({ type: "error", text1: err.message }),
    });

    setExpandImage(false);
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => setExpandImage((expanded) => !expanded)}
        className={`${expandImage ? "w-full h-full" : "w-40 h-40 "}   shadow-md shadow-primary relative rounded-full`}
      >
        <Image
          source={
            image
              ? { uri: `${API_URL}/${image}` }
              : require("@/assets/images/icon.png")
          }
          className="w-full h-full rounded-full"
          resizeMode="contain"
        ></Image>
      </TouchableOpacity>
      {expandImage && (
        <FromButton
          text="Upload New.."
          onSubmit={handleChangeImage}
          isLoading={updateImageMutation.isPending}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({});
