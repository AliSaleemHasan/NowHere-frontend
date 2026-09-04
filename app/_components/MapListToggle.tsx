import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export type MapViewMode = "map" | "list";

type Props = {
  mode: MapViewMode;
  onChange: (mode: MapViewMode) => void;
};

function ToggleTab({
  selected,
  onPress,
  icon,
  label,
  testID,
}: {
  selected: boolean;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  testID: string;
}) {
  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`flex-row items-center rounded-full px-3.5 py-2 ${
        selected ? "bg-primary" : ""
      }`}
    >
      <Ionicons
        name={icon}
        size={14}
        color={selected ? "#ffffff" : "#0f0d23"}
      />
      <Text
        className={`ml-1.5 text-xs font-semibold ${
          selected ? "text-white" : "text-primary"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function MapListToggle({ mode, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View
      testID="map-list-toggle"
      accessibilityRole="tablist"
      accessibilityLabel={t("map.toggleA11y")}
      className="flex-row rounded-full bg-white p-1 shadow-sm"
    >
      <ToggleTab
        testID="map-list-toggle-map"
        selected={mode === "map"}
        onPress={() => onChange("map")}
        icon="map-outline"
        label={t("map.toggleMap")}
      />
      <ToggleTab
        testID="map-list-toggle-list"
        selected={mode === "list"}
        onPress={() => onChange("list")}
        icon="list-outline"
        label={t("map.toggleList")}
      />
    </View>
  );
}
