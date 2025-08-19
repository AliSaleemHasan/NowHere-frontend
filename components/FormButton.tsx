import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TouchableOpacity,
} from "react-native";

interface Props {
  disabled?: boolean;
  isLoading?: boolean;
  text: string;
  onSubmit: (...input: any) => any;
}
export default function FromButton(props: Props) {
  return (
    <TouchableOpacity
      onPress={props.onSubmit} // run after layout stabilizes
      onPressIn={() => {
        Keyboard.dismiss();
      }}
      disabled={props.disabled}
      className={`${!props.disabled ? "bg-primary" : "bg-gray-600"}   w-full h-12 items-center justify-center`}
    >
      {props.isLoading ? (
        <ActivityIndicator size={20} color={"primary"} />
      ) : (
        <Text className="text-center text-white ">{props.text}</Text>
      )}
    </TouchableOpacity>
  );
}
