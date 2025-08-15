import Checkbox from "expo-checkbox";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TouchableOpacity } from "react-native";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: keyof T;
  value: string;
  label: string;
};

export function TagCheckbox<T extends FieldValues>({
  control,
  name,
  value,
  label,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field: { value: selectedValue, onChange } }) => {
        const isSelected = selectedValue === value;
        return (
          <TouchableOpacity
            className={`p-2 rounded-lg ${
              isSelected ? "bg-primary" : "bg-gray-200"
            }`}
            onPress={() => onChange(value)}
          >
            {/* Hidden checkbox just for accessibility */}
            <Checkbox
              value={isSelected}
              onValueChange={() => onChange(value)}
              className="opacity-0 absolute"
            />
            <Text
              className={` text-xs ${isSelected ? "text-white" : "text-black"}`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
