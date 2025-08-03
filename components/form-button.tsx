import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
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
      onPress={props.onSubmit}
      disabled={props.disabled}
      className={`${!props.disabled ? "bg-primary" : "bg-gray-600"}   w-full`}
    >
      {props.isLoading ? (
        <ActivityIndicator size={20} color={"primary"} />
      ) : (
        <Text className="text-center text-white p-3">{props.text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
