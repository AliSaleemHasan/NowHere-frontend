import React from "react";
import { Text, View } from "react-native";

interface Props {
  message?: string;
  errors?: string[];
}

export default function FormError({ message, errors }: Props) {
  if (errors && errors.length > 0) {
    return (
      <View className="my-1 gap-1 rounded-lg border border-error/30 bg-red-50/80 p-2.5">
        {errors.map((text, idx) => (
          <Text key={`${text}-${idx}`} className="text-xs font-medium text-error">
            • {text}
          </Text>
        ))}
      </View>
    );
  }

  if (!message) return null;
  return (
    <View className="my-1 rounded-lg border border-error/30 bg-red-50/80 p-2.5">
      <Text className="text-xs font-medium text-error">{message}</Text>
    </View>
  );
}
