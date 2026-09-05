import TagIcon from "@/components/TagIcon";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  pinColor?: string;
  tag?: string;
  badge?: string;
};

export default function MapPinMark({ pinColor, tag, badge }: Props) {
  return (
    <View
      testID="map-pin-mark"
      className="h-8 w-8 items-center justify-center"
      collapsable={false}
    >
      <View
        className="h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md"
        style={{ backgroundColor: pinColor ?? "#FF3B30" }}
      >
        {tag ? <TagIcon tag={tag} size={16} color="#ffffff" /> : null}
      </View>
      {badge ? (
        <View
          testID="map-marker-badge"
          pointerEvents="none"
          className="absolute bottom-0 w-8 items-center rounded-full bg-emerald-600 px-0.5"
        >
          <Text
            className="text-[7px] font-bold uppercase text-white"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
