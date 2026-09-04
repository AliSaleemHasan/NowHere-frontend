import { cn } from "@/utils";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type SettingsChoiceRowProps<T extends number> = {
  label: string;
  description: string;
  options: readonly T[];
  value: T | undefined;
  onChange: (value: T) => void;
  formatOption: (value: T) => string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export function SettingsChoiceRow<T extends number>({
  label,
  description,
  options,
  value,
  onChange,
  formatOption,
  icon,
  disabled,
}: SettingsChoiceRowProps<T>) {
  return (
    <View className="rounded-3xl bg-white p-5 shadow-sm">
      <View className="flex-row items-start gap-3">
        {icon}
        <View className="flex-1">
          <Text className="text-base font-semibold text-primary">{label}</Text>
          <Text className="mt-1 text-sm leading-5 text-gray-500">
            {description}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option)}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: Boolean(disabled) }}
              accessibilityLabel={formatOption(option)}
              className={cn(
                "rounded-full px-4 py-2",
                selected ? "bg-primary" : "bg-gray-100",
                disabled && "opacity-50",
              )}
            >
              <Text
                className={cn(
                  "text-sm font-medium",
                  selected ? "text-white" : "text-primary",
                )}
              >
                {formatOption(option)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
