import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeScreen, type Edge } from "./SafeScreen";

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 24 },
});

const AvoidKeyboard = ({
  children,
  edges,
}: {
  children: ReactNode;
  edges?: readonly Edge[];
}) => {
  const scroll = (
    <KeyboardAwareScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      bottomOffset={48}
      extraKeyboardSpace={24}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </KeyboardAwareScrollView>
  );

  if (!edges) return scroll;

  return (
    <SafeScreen edges={edges} className="bg-white">
      {scroll}
    </SafeScreen>
  );
};

export default AvoidKeyboard;
