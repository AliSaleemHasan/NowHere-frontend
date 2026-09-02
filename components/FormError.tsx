import React from "react";
import { Text, View } from "react-native";

interface Props {
  message?: string;
  errors?: (string | { message?: string } | any)[];
}

export default function FormError({ message, errors }: Props) {
  if (errors && Array.isArray(errors) && errors.length > 0) {
    return (
      <View className="gap-1 my-1 p-2.5 bg-red-50/80 border border-error/30 rounded-lg">
        {errors.map((err, idx) => {
          const text =
            typeof err === "string"
              ? err
              : err?.message || (typeof err === "object" ? JSON.stringify(err) : String(err));
          return (
            <Text key={idx} className="text-xs text-error font-medium">
              • {text}
            </Text>
          );
        })}
      </View>
    );
  }

  if (!message) return null;
  return (
    <View className="my-1 p-2.5 bg-red-50/80 border border-error/30 rounded-lg">
      <Text className="text-xs text-error font-medium">{message}</Text>
    </View>
  );
}


