import TagIcon from "@/components/TagIcon";
import { displayTag, tagColor, Tags } from "@/utils";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TouchableOpacity } from "react-native";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  value: Tags;
};

export function TagCheckbox<T extends FieldValues>({
  control,
  name,
  value,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value: selectedValue, onChange } }) => {
        const isSelected = selectedValue === value;
        const color = tagColor(value);
        return (
          <TouchableOpacity
            onPress={() => onChange(value)}
            className="flex-row items-center rounded-full border px-3 py-2"
            style={{
              backgroundColor: isSelected ? color : "#f3f4f6",
              borderColor: isSelected ? color : "#e5e7eb",
            }}
          >
            <TagIcon
              tag={value}
              size={14}
              color={isSelected ? "#ffffff" : color}
            />
            <Text
              className={`ml-1.5 text-xs font-semibold ${isSelected ? "text-white" : "text-gray-700"}`}
            >
              {displayTag(value)}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
