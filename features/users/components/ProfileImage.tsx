import { AppCamera } from "@/components/camera";
import { patchUser } from "@/features/users/context/user-store";
import { getErrorMessage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { updateUserImage } from "../api/updateUserImage";
import { userQueryKeys } from "../api/user-query";

interface Props {
  userId?: string;
  image?: string;
  size?: number;
}

export default function ProfileImage({ userId, image, size = 112 }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const updateImageMutation = useMutation({
    mutationFn: updateUserImage,
  });

  const handleUploadPhoto = async (photoUri: string) => {
    setIsCameraOpen(false);
    setIsPreviewOpen(false);

    updateImageMutation.mutate(photoUri, {
      onSuccess: (payload) => {
        if (payload?.user) {
          queryClient.setQueryData(userQueryKeys.detail(userId), payload);
          patchUser({
            ...payload.user,
            userImage: payload.userImage || payload.user.image,
          });
        }
        queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(userId) });
        Toast.show({
          type: "success",
          text1: t("users.profile.photo.updated"),
        });
      },
      onError: (err: unknown) => {
        Toast.show({
          type: "error",
          text1: t("users.profile.photo.updateError"),
          text2: getErrorMessage(err),
        });
      },
    });
  };

  return (
    <>
      <View style={{ width: size, height: size }} className="relative">
        <TouchableOpacity
          onPress={() => setIsPreviewOpen(true)}
          className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-sm"
          accessibilityLabel={t("users.profile.photo.viewA11y")}
        >
          <Image
            source={
              image ? { uri: image } : require("@/assets/images/icon.png")
            }
            resizeMode="cover"
            className="h-full w-full"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsCameraOpen(true)}
          disabled={updateImageMutation.isPending}
          className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary"
          accessibilityLabel={t("users.profile.photo.changeA11y")}
        >
          <Ionicons name="camera" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isPreviewOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsPreviewOpen(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/80 px-6">
          <Image
            source={
              image ? { uri: image } : require("@/assets/images/icon.png")
            }
            className="h-72 w-72 rounded-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => {
              setIsPreviewOpen(false);
              setIsCameraOpen(true);
            }}
            className="mt-6 rounded-full bg-white px-5 py-3"
          >
            <Text className="font-semibold text-primary">
              {t("users.profile.photo.takeNew")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsPreviewOpen(false)}
            className="mt-3 px-5 py-2"
          >
            <Text className="text-white">{t("users.profile.photo.close")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={isCameraOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsCameraOpen(false)}
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
