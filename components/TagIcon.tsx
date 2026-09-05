import { displayTag, isTag, tagColor, Tags } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

const TAG_ICONS: Record<Tags, keyof typeof Ionicons.glyphMap> = {
  [Tags.SOCIAL]: "people",
  [Tags.INTERESTING]: "sparkles",
  [Tags.HIDDEN_GEM]: "diamond",
  [Tags.FINDINGS]: "search",
  [Tags.LOST]: "help-circle",
  [Tags.PROMOTION]: "megaphone",
  [Tags.PROOMOTION]: "megaphone",
};

type Props = {
  tag: string;
  size?: number;
  color?: string;
  testID?: string;
};

export default function TagIcon({
  tag,
  size = 16,
  color,
  testID,
}: Props) {
  const key = isTag(tag) ? tag : Tags.SOCIAL;
  return (
    <View
      testID={testID ?? "tag-icon"}
      accessibilityLabel={displayTag(key)}
      collapsable={false}
    >
      <Ionicons name={TAG_ICONS[key]} size={size} color={color ?? tagColor(key)} />
    </View>
  );
}
