import FromButton from "@/components/FormButton";
import { apiAuthFetch } from "@/lib/fetch-api";
import { handleCameraCapture } from "@/lib/image-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
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
        api: "users",
        contentType: "files",
        options: {
          method: "PUT",
          body: data,
        },
      }),
  });

  const handleChangeImage = async () => {
    const capture = await handleCameraCapture({
      aspect: [1, 1],
      quality: 0.7,
    });
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
        queryClient.invalidateQueries({ queryKey: ["profile", userId] });
        queryClient.invalidateQueries({ queryKey: ["user", userId] });
        Toast.show({ type: "success", text1: "Profile image updated" });
      },
      onError: (err) => {
        Toast.show({ type: "error", text1: err.message });
      },
    });

    setExpandImage(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setExpandImage((expanded) => !expanded)}
        className={`${expandImage ? "w-full flex-1" : "w-40 h-40 "}  bg-transparent  shadow-sm shadow-primary  rounded-full relative`}
      >
        <Image
          source={
            image ? { uri: `${image}` } : require("@/assets/images/icon.png")
          }
          resizeMode="contain"
          className="w-full h-full rounded-full"
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
