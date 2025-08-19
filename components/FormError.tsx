import React from "react";
import { Text } from "react-native";

interface Props {
  message?: string;
}
export default function FormError({ message }: Props) {
  return <Text className="text-xs text-red-500">{message}</Text>;
}
