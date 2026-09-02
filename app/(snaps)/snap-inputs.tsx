import AvoidKeyboard from "@/components/AvoidKeyboard";
import FromButton from "@/components/FormButton";
import { Input } from "@/components/Input";
import {
  createSnapWithDirectUpload,
  CreateSnapInput,
} from "@/features/snaps/api/post-new-snap";
import { TagCheckbox } from "@/features/snaps/components/TagsCheckBoxes";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnap } from "@/features/snaps/context/snap-store";
import { Tags } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";
const AddSnapSchema = z.object({
  description: z.string().min(1),
  tag: z.enum(Tags),
});

type AddSnapData = z.infer<typeof AddSnapSchema>;

export default function SnapInputs() {
  const router = useRouter();
  const { handleSubmit, setValue, control, formState } = useForm<AddSnapData>({
    defaultValues: {
      tag: Tags.SOCIAL,
      description: "",
    },
    resolver: zodResolver(AddSnapSchema),
  });
  const snaps = useSnap((state) => state.snaps);
  const location = useLocation((state) => state.location);
  const clearSnaps = useSnap((state) => state.clearSnaps);

  // Scalable direct-to-storage mutation
  const addSnapMutation = useMutation({
    mutationFn: (input: CreateSnapInput) => createSnapWithDirectUpload(input),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Snap Uploaded",
        text2: "Your snap was successfully shared 🎉",
      });

      // removing snaps from secure store
      clearSnaps();

      router.replace("/");
    },
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: "Snap Uploading Error",
        text2: err?.message || "Something went wrong. Please try again.",
      });
    },
  });

  const onSubmit = (data: AddSnapData) => {
    addSnapMutation.mutate({
      snaps,
      location,
      description: data.description,
      tag: data.tag,
    });
  };

  return (
    <AvoidKeyboard>
      <View className="p-5 gap-3">
        <View className="flex-row items-center justify-between gap-1">
          <Text className="text-sm">Please Enter Snap Description</Text>
          {formState.dirtyFields.description && (
            <TouchableOpacity
              className="flex-1"
              onPress={() => setValue("description", "")}
            >
              <Text className="text-sm text-right font-light ">CLEAR</Text>
            </TouchableOpacity>
          )}
        </View>
        <Input
          control={control}
          name="description"
          className="w-full min-h-24"
          autoCapitalize="characters"
          defaultValue=""
          autoFocus
          placeholder="Description"
          numberOfLines={6}
          multiline
          returnKeyType="next"
        ></Input>

        <View className="flex-row flex-wrap gap-2">
          {Object.values(Tags).map((tag) => (
            <TagCheckbox
              key={tag}
              control={control}
              name="tag"
              value={tag}
              label={tag}
            />
          ))}
        </View>

        <FromButton
          onSubmit={handleSubmit(onSubmit)}
          text="Done"
          disabled={!formState.isValid}
          isLoading={formState.isLoading || formState.isSubmitting}
        ></FromButton>
      </View>
    </AvoidKeyboard>
  );
}
