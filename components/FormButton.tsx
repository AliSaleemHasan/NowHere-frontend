import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Keyboard,
  Text,
  TouchableOpacity,
} from "react-native";

interface Props {
  disabled?: boolean;
  isLoading?: boolean;
  text: string;
  onSubmit: (event: GestureResponderEvent) => void;
}

export default function FormButton(props: Props) {
  const disabled = Boolean(props.disabled || props.isLoading);

  return (
    <TouchableOpacity
      onPress={props.onSubmit}
      onPressIn={() => {
        Keyboard.dismiss();
      }}
      disabled={disabled}
      className={`${disabled ? "bg-disabled" : "bg-primary"} h-12 w-full items-center justify-center rounded-2xl`}
    >
      {props.isLoading ? (
        <ActivityIndicator size={20} color="#ffffff" />
      ) : (
        <Text className="text-center font-semibold text-light">{props.text}</Text>
      )}
    </TouchableOpacity>
  );
}
