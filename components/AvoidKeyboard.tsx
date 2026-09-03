import type { ReactNode } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const AvoidKeyboard = ({ children }: { children: ReactNode }) => {
  return (
    <KeyboardAwareScrollView className="flex-1 bg-white" bottomOffset={40}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default AvoidKeyboard;
