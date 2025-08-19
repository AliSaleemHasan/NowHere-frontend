import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
}
export default function SocialNetworkButton({ icon, bg }: Props) {
  return (
    <TouchableOpacity
      className={cn("w-24 h-12 items-center justify-center rounded-full", bg)}
    >
      <Ionicons name={icon} size={20} color={"white"}></Ionicons>
    </TouchableOpacity>
  );
}
