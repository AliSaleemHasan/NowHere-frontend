import type { ReactNode } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeScreen, type Edge } from "./SafeScreen";

const AvoidKeyboard = ({
  children,
  edges,
}: {
  children: ReactNode;
  edges?: readonly Edge[];
}) => {
  const scroll = (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerClassName="grow"
      keyboardShouldPersistTaps="handled"
      bottomOffset={40}
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
