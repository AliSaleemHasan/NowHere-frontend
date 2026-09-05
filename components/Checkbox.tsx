import ExpoCheckbox, { type CheckboxProps } from "expo-checkbox";
import React, { type ReactNode } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

interface Props {
  isSelected?: boolean;
  label: string;
  icon?: ReactNode;
  buttonProps: TouchableOpacityProps;
}

export default function CustomCheckbox(props: Props & CheckboxProps) {
  const { isSelected, label, icon, buttonProps, ...checkboxProps } = props;

  return (
    <TouchableOpacity
      {...buttonProps}
      className={`flex-row items-center gap-1.5 rounded-lg p-2 ${isSelected ? "bg-primary" : "bg-gray-400"}`}
    >
      {/* Hidden checkbox just for accessibility */}
      <ExpoCheckbox
        {...checkboxProps}
        value={isSelected}
        className="opacity-0 absolute"
      />
      {icon ? <View pointerEvents="none">{icon}</View> : null}
      <Text className={` text-xs ${isSelected ? "text-light" : "text-dark"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
