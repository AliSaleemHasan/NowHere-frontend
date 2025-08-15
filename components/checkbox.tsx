import Checkbox, { CheckboxProps } from "expo-checkbox";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, View } from "react-native";

interface Props<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  text: string;
  control: Control<TFieldValues>;
}

export default function CustomCheckbox<TFieldValues extends FieldValues>(
  props: Props<TFieldValues> & CheckboxProps
) {
  const { name, text, control, ...checkboxProps } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="flex-row gap-4 px-2 py-3 bg-red-400">
          <Checkbox
            {...checkboxProps}
            value={value}
            onValueChange={onChange}
            color={value ? "#4630EB" : undefined}
          ></Checkbox>
          <Text>{text}</Text>
        </View>
      )}
    />
  );
}
