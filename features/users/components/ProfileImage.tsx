import AppCamera from "@/components/camera/AppCamera";
import FromButton from "@/components/FormButton";
import { apiAuthFetch } from "@/lib/fetch-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Image, Modal, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  userId?: string;
  image?: string;
}

export default function ProfileImage({ userId, image }: Props) {
  const queryClient = useQueryClient();
  const [expandImage, setExpandImage] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const updateImageMutation = useMutation({
    mutationFn: async (data: FormData) =>
      await apiAuthFetch({
        url: "image",
        api: "users",
        contentType: "files",
        options: {
          method: "PUT",
          body: data,
        },
      }),
  });

  const handleUploadPhoto = async (photoUri: string) => {
    setIsCameraOpen(false);
    setExpandImage(false);

    const payload = new FormData();
    payload.set("photo", {
      uri: photoUri,
      name: photoUri.split("/").pop() || crypto.randomUUID(),
      type: `image/${photoUri.split(".").pop() || "jpg"}`,
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
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setExpandImage((expanded) => !expanded)}
        className={`${expandImage ? "w-full flex-1" : "w-40 h-40 "}  bg-transparent shadow-sm shadow-primary rounded-full relative`}
      >
        <Image
          source={
            image ? { uri: `${image}` } : require("@/assets/images/icon.png")
          }
          resizeMode="contain"
          className="w-full h-full rounded-full"
        />
      </TouchableOpacity>
      {expandImage && (
        <FromButton
          text="Upload New.."
          onSubmit={() => setIsCameraOpen(true)}
          isLoading={updateImageMutation.isPending}
        />
      )}

      <Modal
        visible={isCameraOpen}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AppCamera
          onCapture={handleUploadPhoto}
          onClose={() => setIsCameraOpen(false)}
          initialFacing="front"
        />
      </Modal>
    </>
  );
}
