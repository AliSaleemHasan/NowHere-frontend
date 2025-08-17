import CustomCheckbox from "@/components/checkbox";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

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
          <CustomCheckbox
            isSelected={isSelected}
            label={label}
            buttonProps={{ onPress: () => onChange(value) }}
            onValueChange={() => onChange(value)}
          ></CustomCheckbox>
        );
      }}
    />
  );
}
