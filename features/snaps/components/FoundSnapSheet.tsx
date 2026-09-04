import FormButton from "@/components/FormButton";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MAX_RESOLUTION_NOTE } from "../types/snaps-api-type";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (note?: string) => void;
  isSubmitting?: boolean;
};

export default function FoundSnapSheet({
  visible,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!visible) setNote("");
  }, [visible]);

  const handleSubmit = () => {
    if (isSubmitting) return;
    const trimmed = note.trim();
    onSubmit(trimmed ? trimmed : undefined);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable
            testID="found-sheet-dismiss"
            className="flex-1"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t("snaps.found.closeA11y")}
          />
          <View
            testID="found-sheet"
            className="rounded-t-3xl bg-white px-5 pt-5"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          >
            <Text className="text-lg font-semibold text-primary">
              {t("snaps.found.title")}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-gray-500">
              {t("snaps.found.body")}
            </Text>

            <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t("snaps.found.noteLabel")}
            </Text>
            <TextInput
              testID="found-note"
              value={note}
              onChangeText={(value) =>
                setNote(value.slice(0, MAX_RESOLUTION_NOTE))
              }
              placeholder={t("snaps.found.notePlaceholder")}
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={MAX_RESOLUTION_NOTE}
              className="mt-2 min-h-[88px] rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-primary"
            />
            <Text className="mt-1 text-right text-[10px] text-gray-400">
              {note.length}/{MAX_RESOLUTION_NOTE}
            </Text>

            <View className="mt-4">
              <FormButton
                text={t("snaps.found.submit")}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            </View>
            <Pressable
              onPress={onClose}
              disabled={isSubmitting}
              className="mt-3 items-center py-2"
            >
              <Text className="text-sm font-medium text-gray-500">
                {t("snaps.actions.cancel")}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
