import React, { PropsWithChildren } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

export default function AvoidKeyboard(props: PropsWithChildren) {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}
    >
      <KeyboardAvoidingView
        className="flex-1  "
        behavior={Platform.select({ ios: "padding", android: "padding" })}
        keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
      >
        {props.children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({});
