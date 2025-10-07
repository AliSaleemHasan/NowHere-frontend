import CustomCheckbox from "@/components/Checkbox";
import FromButton from "@/components/FormButton";
import { useAuth } from "@/features/auth/context/auth-store";
import { Tags } from "@/utils";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, { PropsWithChildren, useCallback, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TagsFilter = ({ children }: PropsWithChildren) => {
  const params = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const [searchTags, setSearchTags] = useState<Tags[]>(
    (params?.tags as Tags[]) || []
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleTagsFilter = () => {
    router.setParams({
      tags: searchTags,
    });
    bottomSheetRef.current?.close();
  };
  return (
    <GestureHandlerRootView className="flex-1">
      {children}

      <View className="absolute top-20 right-5 flex gap-4">
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.expand()}
          className=" gap-1 bg-white py-6 px-5 rounded-full z-50 items-center"
        >
          <FontAwesome size={10}>tags</FontAwesome>
        </TouchableOpacity>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose
        backdropComponent={renderBackdrop} // 👈 add backdrop
      >
        <BottomSheetView className="p-4 flex-1  gap-4">
          <View className="flex-row items-center gap-4">
            <Text>Show Snaps of type :</Text>
            {searchTags.length > 0 && (
              <TouchableOpacity
                className="flex-1"
                hitSlop={10}
                onPress={() => setSearchTags([])}
              >
                <Text className=" font-thin text-sm  ">Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="items-center flex-row flex-wrap gap-2">
            {Object.values(Tags).map((tag, index) => (
              <CustomCheckbox
                isSelected={searchTags.includes(tag)}
                label={tag}
                key={`${tag}_${index}`}
                buttonProps={{
                  onPress: () =>
                    setSearchTags((tags) =>
                      searchTags.includes(tag)
                        ? tags.filter((item) => item !== tag)
                        : [...tags, tag]
                    ),
                }}
              ></CustomCheckbox>
            ))}
          </View>
          {isLoggedIn && (
            <View className="flex-row gap-3 font-bold">
              <TouchableOpacity
                onPress={() => {
                  router.setParams({
                    seen: !params.seen || params.seen === "0" ? "1" : "0",
                  });
                }}
              >
                <Text
                  className={`underline ${params.seen === "1" && "color-alert"}`}
                >
                  Show Seen Snaps
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <FromButton text="Search" onSubmit={handleTagsFilter}></FromButton>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default TagsFilter;
