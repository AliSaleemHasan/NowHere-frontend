import AvoidKeyboard from "@/components/AvoidKeyboard";
import FormButton from "@/components/FormButton";
import FormError from "@/components/FormError";
import { Input } from "@/components/Input";
import {
  createSnapWithDirectUpload,
  CreateSnapInput,
} from "@/features/snaps/api/post-new-snap";
import { TagCheckbox } from "@/features/snaps/components/TagsCheckBoxes";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnapDraft } from "@/features/snaps/context/snap-store";
import { MAX_SNAP_IMAGES } from "@/lib/image-upload";
import { requireSnapLocation } from "@/lib/location";
import { snapQueryKeys, upsertNearSnap } from "@/features/snaps/api/snap-query";
import { isValidSnapLocation } from "@/features/snaps/types/snaps-api-type";
import { getApiValidationErrors, getErrorMessage, SELECTABLE_TAGS } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";

const AddSnapSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Add a short description")
    .max(280, "Keep it under 280 characters"),
  tag: z.enum(SELECTABLE_TAGS),
});

type AddSnapData = z.infer<typeof AddSnapSchema>;

export default function SnapInputs() {
  const router = useRouter();
  const { handleSubmit, control, formState, watch } = useForm<AddSnapData>({
    defaultValues: {
      tag: SELECTABLE_TAGS[0],
      description: "",
    },
    resolver: zodResolver(AddSnapSchema),
    mode: "onChange",
  });
  const snaps = useSnapDraft((state) => state.snaps);
  const removeSnap = useSnapDraft((state) => state.removeSnap);
  const location = useLocation((state) => state.location);
  const setLocation = useLocation((state) => state.setLocation);
  const fetchLocation = useLocation((state) => state.fetchLocation);
  const clearSnaps = useSnapDraft((state) => state.clearSnaps);
  const description = watch("description");
  const queryClient = useQueryClient();
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const hasLocation = isValidSnapLocation(location);

  useEffect(() => {
    void fetchLocation();
  }, [fetchLocation]);

  const addSnapMutation = useMutation({
    mutationFn: (input: CreateSnapInput) => createSnapWithDirectUpload(input),
    onSuccess: (created) => {
      upsertNearSnap(queryClient, created);
      void queryClient.invalidateQueries({ queryKey: snapQueryKeys.near });

      Toast.show({
        type: "success",
        text1: "Snap shared",
        text2: "People nearby can discover it now.",
      });
      clearSnaps();
      router.replace("/");
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(
        err,
        "Something went wrong. Please try again.",
      );
      const alreadyPosted = /already posted/i.test(message);

      if (alreadyPosted) {
        void queryClient.invalidateQueries({ queryKey: snapQueryKeys.near });
        Toast.show({
          type: "info",
          text1: "Already shared here today",
          text2: "Your snap for this area is on the map. Move farther to post again.",
        });
        clearSnaps();
        router.replace("/");
        return;
      }

      Toast.show({
        type: "error",
        text1: "Couldn’t share snap",
        text2: message,
      });
    },
  });

  const onSubmit = async (data: AddSnapData) => {
    setIsResolvingLocation(true);
    try {
      const point = await requireSnapLocation();
      setLocation(point);
      addSnapMutation.mutate({
        snaps,
        location: point,
        description: data.description.trim(),
        tag: data.tag,
      });
    } catch (err: unknown) {
      Toast.show({
        type: "error",
        text1: "Location required",
        text2: getErrorMessage(
          err,
          "Enable GPS to share a snap from this spot.",
        ),
      });
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const canSubmit =
    formState.isValid &&
    snaps.length > 0 &&
    !addSnapMutation.isPending &&
    !isResolvingLocation;

  return (
    <AvoidKeyboard>
      <View className="flex-1 gap-5 p-5">
        <View>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-primary">Photos</Text>
            <Text className="text-xs text-gray-500">
              {snaps.length}/{MAX_SNAP_IMAGES}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {snaps.map((uri) => (
                <View key={uri} className="relative">
                  <Image
                    source={{ uri }}
                    className="h-28 w-24 rounded-2xl bg-gray-100"
                  />
                  <TouchableOpacity
                    onPress={() => removeSnap(uri)}
                    className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-black/60"
                  >
                    <Ionicons name="close" size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}
              {snaps.length < MAX_SNAP_IMAGES ? (
                <TouchableOpacity
                  onPress={() => router.replace("/(snaps)/snaps-capture")}
                  className="h-28 w-24 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50"
                >
                  <Ionicons name="camera-outline" size={22} color="#6b7280" />
                  <Text className="mt-1 text-xs text-gray-500">Add</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        </View>

        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-primary">
              Description
            </Text>
            <Text className="text-xs text-gray-400">
              {description.trim().length}/280
            </Text>
          </View>
          <Input
            control={control}
            name="description"
            className="min-h-28 w-full"
            autoCapitalize="sentences"
            placeholder="What’s happening here?"
            numberOfLines={6}
            multiline
            textAlignVertical="top"
            returnKeyType="done"
          />
        </View>

        <View className="gap-2">
          <Text className="text-base font-semibold text-primary">Tag</Text>
          <Text className="text-xs text-gray-500">
            Helps people nearby know what they’re looking at.
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {SELECTABLE_TAGS.map((tag) => (
              <TagCheckbox
                key={tag}
                control={control}
                name="tag"
                value={tag}
              />
            ))}
          </View>
        </View>

        <View className="flex-row items-center gap-2 rounded-2xl bg-gray-50 px-4 py-3">
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text className="flex-1 text-xs text-gray-500">
            {hasLocation
              ? `Sharing at ${location.coordinates[1].toFixed(5)}, ${location.coordinates[0].toFixed(5)}. One snap per area each day.`
              : "We’ll attach your current GPS when you share. Location is required."}
          </Text>
        </View>

        {addSnapMutation.isError ? (
          <FormError
            message={getErrorMessage(addSnapMutation.error)}
            errors={getApiValidationErrors(addSnapMutation.error)}
          />
        ) : null}

        <FormButton
          onSubmit={handleSubmit(onSubmit)}
          text={
            isResolvingLocation
              ? "Getting location…"
              : addSnapMutation.isPending
                ? "Sharing…"
                : "Share snap"
          }
          disabled={!canSubmit}
          isLoading={addSnapMutation.isPending || isResolvingLocation}
        />
      </View>
    </AvoidKeyboard>
  );
}
