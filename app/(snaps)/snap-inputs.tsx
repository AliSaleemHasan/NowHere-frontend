import AvoidKeyboard from "@/components/avoid-keyboard";
import FromButton from "@/components/form-button";
import { Input } from "@/components/input";
import { PostSnapBody } from "@/features/snaps/api/post-new-snap";
import { useSnap } from "@/features/snaps/context/snap-store";
import { fetchWithoutAuth } from "@/lib/fetch-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import * as z from "zod";
const AddSnapSchema = z.object({
  description: z.string(),
});

type AddSnapData = z.infer<typeof AddSnapSchema>;

export default function SnapInputs() {
  const { handleSubmit, setValue, control, formState } = useForm<AddSnapData>({
    resolver: zodResolver(AddSnapSchema),
  });
  const snaps = useSnap((state) => state.snaps);
  const addSnapMutation = useMutation({
    mutationFn: (files: FormData) => {
      return fetchWithoutAuth({
        url: "snaps",
        options: {
          method: "POST",
          body: files,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      });
    },
  });

  const onSubmit = () => {
    const payload = PostSnapBody(snaps);
    addSnapMutation.mutate(payload);
  };

  return (
    <AvoidKeyboard>
      <View className="p-5 gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm">Please Enter Snap Description</Text>
          {formState.dirtyFields.description && (
            <TouchableOpacity onPress={() => setValue("description", "")}>
              <Text className="text-sm font-light ">CLEAR</Text>
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
        <FromButton
          onSubmit={handleSubmit(onSubmit)}
          text="Done"
          disabled={!formState.isValid}
          isLoading={formState.isLoading}
        ></FromButton>
      </View>
    </AvoidKeyboard>
  );
}
