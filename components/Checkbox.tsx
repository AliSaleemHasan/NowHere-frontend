import Checkbox, { CheckboxProps } from "expo-checkbox";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface Props {
  isSelected?: boolean;
  label: string;
  buttonProps: TouchableOpacityProps;
}

export default function CustomCheckbox(props: Props & CheckboxProps) {
  const { isSelected, label, buttonProps, ...checkboxProps } = props;

  return (
    <TouchableOpacity
      {...buttonProps}
      className={`p-2 rounded-lg ${isSelected ? "bg-primary" : "bg-disabled"}`}
    >
      {/* Hidden checkbox just for accessibility */}
      <Checkbox
        {...checkboxProps}
        value={isSelected}
        className="opacity-0 absolute"
      />
      <Text className={` text-xs ${isSelected ? "text-light" : "text-dark"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
