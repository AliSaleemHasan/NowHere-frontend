import CustomCheckbox from "@/components/Checkbox";
import FormButton from "@/components/FormButton";
import TagIcon from "@/components/TagIcon";
import {
  displayTag,
  parseTagsParam,
  SELECTABLE_TAGS,
  tagColor,
  Tags,
} from "@/utils";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type TagsFilterApi = {
  openFilter: () => void;
};

const TagsFilter = ({
  children,
  isLoggedIn = false,
}: {
  children: (api: TagsFilterApi) => ReactNode;
  isLoggedIn?: boolean;
}) => {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    tags?: string | string[];
    seen?: string;
  }>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchTags, setSearchTags] = useState<Tags[]>(() =>
    parseTagsParam(params.tags),
  );

  const showSeen = params.seen === "1";

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  const openFilter = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleTagsFilter = () => {
    router.setParams({
      tags: searchTags,
    });
    bottomSheetRef.current?.close();
  };

  return (
    <GestureHandlerRootView className="flex-1">
      {children({ openFilter })}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1 gap-4 p-4">
          <View className="flex-row items-center gap-4">
            <Text className="font-medium">{t("map.filterTitle")}</Text>
            {searchTags.length > 0 && (
              <TouchableOpacity
                className="flex-1"
                hitSlop={10}
                onPress={() => setSearchTags([])}
              >
                <Text className="text-right text-sm font-thin">
                  {t("map.filterClear")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row flex-wrap items-center gap-2">
            {SELECTABLE_TAGS.map((tag) => (
              <CustomCheckbox
                isSelected={searchTags.includes(tag)}
                label={displayTag(tag)}
                icon={
                  <TagIcon
                    tag={tag}
                    size={14}
                    color={
                      searchTags.includes(tag) ? "#ffffff" : tagColor(tag)
                    }
                  />
                }
                key={tag}
                buttonProps={{
                  onPress: () =>
                    setSearchTags((tags) =>
                      tags.includes(tag)
                        ? tags.filter((item) => item !== tag)
                        : [...tags, tag],
                    ),
                }}
              />
            ))}
          </View>
          {isLoggedIn && (
            <View className="flex-row gap-2 rounded-2xl bg-gray-100 p-1">
              <TouchableOpacity
                onPress={() => router.setParams({ seen: "0" })}
                className={`flex-1 rounded-2xl py-2 ${!showSeen ? "bg-white" : ""}`}
              >
                <Text
                  className={`text-center text-xs font-semibold ${!showSeen ? "text-primary" : "text-gray-500"}`}
                >
                  {t("map.filterNew")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.setParams({ seen: "1" })}
                className={`flex-1 rounded-2xl py-2 ${showSeen ? "bg-white" : ""}`}
              >
                <Text
                  className={`text-center text-xs font-semibold ${showSeen ? "text-primary" : "text-gray-500"}`}
                >
                  {t("map.filterOpened")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <FormButton text={t("map.filterSearch")} onSubmit={handleTagsFilter} />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default TagsFilter;
