import { cn } from "@/utils";
import React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";

type InputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
};

export function Input<TFieldValues extends FieldValues = FieldValues>(
  props: InputProps<TFieldValues> & TextInputProps,
) {
  const { name, control, ...textInputProps } = props;
  const {
    field: { value, onChange, onBlur },
  } = useController<TFieldValues>({
    name,
    control,
  });

  return (
    <TextInput
      placeholderTextColor="#9ca3af"
      {...textInputProps}
      value={value == null ? "" : String(value)}
      autoCapitalize={textInputProps.autoCapitalize ?? "none"}
      onChangeText={onChange}
      onBlur={onBlur}
      className={cn(
        "rounded-md border border-gray-300 bg-background p-4 text-dark",
        textInputProps.className,
      )}
    />
  );
}
