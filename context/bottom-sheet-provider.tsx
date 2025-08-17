import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface BottomSheetContextState {
  openSheet: (content: React.ReactNode) => void;
  closeSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextState | undefined>(
  undefined
);

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [content, setContent] = useState<React.ReactNode>(null);

  const openSheet = useCallback((node: React.ReactNode) => {
    setContent(node);
    bottomSheetRef.current?.expand();
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setContent(null);
  }, []);

  return (
    <BottomSheetContext.Provider value={{ openSheet, closeSheet }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {children}

        <BottomSheet ref={bottomSheetRef} onClose={() => setContent(null)}>
          <BottomSheetView className="flex-1 p-10 items-center">
            {content}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx)
    throw new Error("useBottomSheet must be used inside BottomSheetProvider");
  return ctx;
};
