import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export type MapViewMode = "map" | "list";

type Props = {
  mode: MapViewMode;
  onChange: (mode: MapViewMode) => void;
};

export default function MapListToggle({ mode, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View
      testID="map-list-toggle"
      accessibilityRole="tablist"
      accessibilityLabel={t("map.toggleA11y")}
      className="absolute left-5 top-20 z-50 flex-row rounded-full bg-white p-1 shadow-sm"
    >
      <TouchableOpacity
        testID="map-list-toggle-map"
        accessibilityRole="tab"
        accessibilityState={{ selected: mode === "map" }}
        onPress={() => onChange("map")}
        className={`rounded-full px-4 py-2 ${mode === "map" ? "bg-primary" : ""}`}
      >
        <Text
          className={`text-xs font-semibold ${mode === "map" ? "text-white" : "text-primary"}`}
        >
          {t("map.toggleMap")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="map-list-toggle-list"
        accessibilityRole="tab"
        accessibilityState={{ selected: mode === "list" }}
        onPress={() => onChange("list")}
        className={`rounded-full px-4 py-2 ${mode === "list" ? "bg-primary" : ""}`}
      >
        <Text
          className={`text-xs font-semibold ${mode === "list" ? "text-white" : "text-primary"}`}
        >
          {t("map.toggleList")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
