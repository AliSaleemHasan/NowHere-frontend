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
      {...textInputProps}
      value={value as string}
      autoCapitalize="none"
      onChangeText={onChange}
      onBlur={onBlur}
      style={[
        { padding: 12, backgroundColor: "#fff", borderRadius: 8 },
        textInputProps.style,
      ]}
    />
  );
}
