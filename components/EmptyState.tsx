import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
  actionTestID?: string;
  tone?: "neutral" | "brand" | "danger";
};

const TONE_STYLES = {
  brand: {
    wrap: "h-16 w-16 bg-primary",
    icon: "#ffffff",
    iconSize: 28,
    title: "text-2xl",
  },
  danger: {
    wrap: "h-14 w-14 bg-red-50",
    icon: "#ef4444",
    iconSize: 24,
    title: "text-base",
  },
  neutral: {
    wrap: "h-14 w-14 bg-white shadow-sm",
    icon: "#0f0d23",
    iconSize: 24,
    title: "text-base",
  },
} as const;

export default function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
  testID,
  actionTestID,
  tone = "neutral",
}: Props) {
  const styles = TONE_STYLES[tone];

  return (
    <View testID={testID} className="items-center px-2 py-6">
      <View
        className={`items-center justify-center rounded-full ${styles.wrap}`}
      >
        <Ionicons name={icon} size={styles.iconSize} color={styles.icon} />
      </View>
      <Text
        className={`mt-4 text-center font-semibold text-primary ${styles.title}`}
      >
        {title}
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
        {body}
      </Text>
      {actionLabel && onAction ? (
        <TouchableOpacity
          testID={actionTestID}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          className="mt-6 rounded-full bg-primary px-5 py-3"
        >
          <Text className="font-semibold text-white">{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
