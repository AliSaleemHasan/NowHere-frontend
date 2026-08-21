import { cn } from "@/utils";
import React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";

type InputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
};

export function Input<TFieldValues extends FieldValues = FieldValues>(
  props: InputProps<TFieldValues> & TextInputProps
) {
  const { name, control, ...textInputProps } = props;
  const {
    field: { value, onChange, onBlur },
  } = useController<TFieldValues>({
    name,
    control,
    defaultValue: "" as any, // you can make this generic too
  });

  return (
    <TextInput
      placeholderTextColor={"#9ca3af"}
      {...textInputProps}
      value={value as string}
      autoCapitalize={textInputProps.autoCapitalize ?? "none"}
      onChangeText={onChange}
      onBlur={onBlur}
      className={cn(
        "text-dark p-4 bg-background border border-gray-300 rounded-md",
        textInputProps.className
      )}
    />
  );
}
