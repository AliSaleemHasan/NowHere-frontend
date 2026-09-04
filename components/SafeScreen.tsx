import { cn } from "@/utils";
import { cssInterop } from "nativewind";
import type { ReactNode } from "react";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

cssInterop(SafeAreaView, { className: "style" });

type Props = {
  children: ReactNode;
  className?: string;
  edges?: readonly Edge[];
  testID?: string;
};

export function SafeScreen({
  children,
  className,
  edges = ["top", "left", "right"],
  testID,
}: Props) {
  return (
    <SafeAreaView
      testID={testID}
      edges={edges}
      className={cn("flex-1", className)}
    >
      {children}
    </SafeAreaView>
  );
}

export { SafeAreaView };
export type { Edge };
