import MapListToggle, { type MapViewMode } from "./MapListToggle";
import { SafeAreaView, SafeScreen } from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  mode: MapViewMode;
  onModeChange: (mode: MapViewMode) => void;
  onOpenFilter: () => void;
  overlay?: boolean;
  children?: ReactNode;
};

function FilterButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      testID="map-filter-button"
      accessibilityRole="button"
      accessibilityLabel={t("map.filterA11y")}
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
    >
      <Ionicons name="options-outline" size={18} color="#0f0d23" />
    </TouchableOpacity>
  );
}

function ExploreToolbar({
  mode,
  onModeChange,
  onOpenFilter,
}: Pick<Props, "mode" | "onModeChange" | "onOpenFilter">) {
  return (
    <View
      testID="explore-toolbar"
      className="flex-row items-center justify-between px-5"
    >
      <MapListToggle mode={mode} onChange={onModeChange} />
      <FilterButton onPress={onOpenFilter} />
    </View>
  );
}

export default function ExploreChrome({
  mode,
  onModeChange,
  onOpenFilter,
  overlay = false,
  children,
}: Props) {
  const { t } = useTranslation();
  const toolbar = (
    <ExploreToolbar
      mode={mode}
      onModeChange={onModeChange}
      onOpenFilter={onOpenFilter}
    />
  );

  if (overlay) {
    return (
      <SafeAreaView
        pointerEvents="box-none"
        edges={["top"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, zIndex: 50 }}
      >
        <View className="pt-2" pointerEvents="box-none">
          {toolbar}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeScreen
      testID="explore-list-screen"
      edges={["top"]}
      className="bg-gray-50"
    >
      <View className="border-b border-gray-200 bg-gray-50 pb-3 pt-2">
        {toolbar}
        <Text className="mt-3 px-5 text-xs font-medium uppercase tracking-widest text-gray-400">
          {t("map.listTitle")}
        </Text>
      </View>
      <View className="flex-1">{children}</View>
    </SafeScreen>
  );
}
