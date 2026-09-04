import AvoidKeyboard from "@/components/AvoidKeyboard";
import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { updateProfile } from "@/features/users/api/update-profile";
import { userQueryKeys } from "@/features/users/api/user-query";
import { useUser } from "@/features/users/api/useUser";
import { patchUser, useUserStore } from "@/features/users/context/user-store";
import {
  updateProfileSchema,
  type UpdateProfileForm,
} from "@/features/users/validation/profile-schema";
import type { GetUserResponse } from "@/types/api";
import { getApiValidationErrors, getErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export const ErrorBoundary = NowHereError;

export default function EditProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const storedUser = useUserStore((state) => state.user);
  const userId = storedUser?.id;
  const userQuery = useUser(userId);
  const user = userQuery.data?.user ?? storedUser;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<UpdateProfileForm>({
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      bio: user?.bio ?? "",
    },
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
  });

  const didHydrate = useRef(false);
  useEffect(() => {
    const profile = userQuery.data?.user;
    if (!profile || didHydrate.current) return;
    didHydrate.current = true;
    if (isDirty) return;
    reset({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      bio: profile.bio ?? "",
    });
  }, [userQuery.data?.user, isDirty, reset]);

  const mutation = useMutation({
    mutationFn: updateProfile,
  });

  const onSubmit = (values: UpdateProfileForm) => {
    Keyboard.dismiss();
    mutation.mutate(values, {
      onSuccess: (data) => {
        const saved = data ?? values;
        patchUser(saved);
        queryClient.setQueryData<GetUserResponse>(
          userQueryKeys.detail(userId),
          (old) =>
            old
              ? {
                  ...old,
                  user: { ...old.user, ...saved },
                  userImage: old.userImage || data?.image || "",
                }
              : old,
        );
        queryClient.invalidateQueries({
          queryKey: userQueryKeys.detail(userId),
        });
        Toast.show({
          type: "success",
          text1: t("users.edit.toastSuccessTitle"),
          text2: t("users.edit.toastSuccessBody"),
        });
        router.back();
      },
      onError: (err: unknown) => {
        Toast.show({
          type: "error",
          text1: t("users.edit.toastErrorTitle"),
          text2: getErrorMessage(err, t("users.edit.toastErrorFallback")),
        });
      },
    });
  };

  if (!userId) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Text className="text-center text-base font-semibold text-primary">
          {t("users.profile.sessionMissingTitle")}
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          {t("users.profile.sessionMissingBody")}
        </Text>
      </View>
    );
  }

  if (userQuery.isLoading && !storedUser) return <Loading />;

  return (
    <AvoidKeyboard>
      <View className="flex-1 bg-gray-50 px-5 py-6">
        <Text className="text-2xl font-semibold text-primary">
          {t("users.edit.title")}
        </Text>
        <View className="mt-5 gap-4">
          <Input
            control={control}
            name="firstName"
            placeholder={t("users.edit.firstNamePlaceholder")}
            autoComplete="given-name"
            textContentType="givenName"
            autoCapitalize="words"
          />
          {errors.firstName?.message ? (
            <FormError message={t(errors.firstName.message)} />
          ) : null}
          <Input
            control={control}
            name="lastName"
            placeholder={t("users.edit.lastNamePlaceholder")}
            autoComplete="family-name"
            textContentType="familyName"
            autoCapitalize="words"
          />
          {errors.lastName?.message ? (
            <FormError message={t(errors.lastName.message)} />
          ) : null}
          <Input
            control={control}
            name="bio"
            placeholder={t("users.edit.bioPlaceholder")}
            multiline
            textAlignVertical="top"
            autoCapitalize="sentences"
            className="min-h-[96px]"
          />
          <FormButton
            onSubmit={handleSubmit(onSubmit)}
            disabled={!isValid}
            text={t("users.edit.submit")}
            isLoading={isSubmitting || mutation.isPending}
          />
          {mutation.error ? (
            <FormError
              message={getErrorMessage(
                mutation.error,
                t("users.edit.toastErrorFallback"),
              )}
              errors={getApiValidationErrors(mutation.error)}
            />
          ) : null}
        </View>
      </View>
    </AvoidKeyboard>
  );
}
