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
import {
  MAX_REPORT_DETAILS,
  REPORT_REASONS,
  type ReportReason,
} from "../types/report-reasons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: { reason: ReportReason; details?: string }) => void;
  isSubmitting?: boolean;
};

export default function ReportSnapSheet({
  visible,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!visible) {
      setReason(null);
      setDetails("");
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!reason || isSubmitting) return;
    const trimmed = details.trim();
    onSubmit({
      reason,
      details: trimmed ? trimmed : undefined,
    });
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
            testID="report-sheet-dismiss"
            className="flex-1"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t("snaps.report.closeA11y")}
          />
          <View
            testID="report-sheet"
            className="rounded-t-3xl bg-white px-5 pt-5"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          >
            <Text className="text-lg font-semibold text-primary">
              {t("snaps.report.title")}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-gray-500">
              {t("snaps.report.body")}
            </Text>

            <View className="mt-4 flex-row flex-wrap gap-2">
              {REPORT_REASONS.map((item) => {
                const selected = reason === item;
                return (
                  <Pressable
                    key={item}
                    testID={`report-reason-${item}`}
                    onPress={() => setReason(item)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    className={`rounded-full px-3 py-2 ${
                      selected ? "bg-primary" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        selected ? "text-white" : "text-primary"
                      }`}
                    >
                      {t(`snaps.report.reasons.${item}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t("snaps.report.detailsLabel")}
            </Text>
            <TextInput
              testID="report-details"
              value={details}
              onChangeText={(value) =>
                setDetails(value.slice(0, MAX_REPORT_DETAILS))
              }
              placeholder={t("snaps.report.detailsPlaceholder")}
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={MAX_REPORT_DETAILS}
              className="mt-2 min-h-[88px] rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-primary"
            />

            <View className="mt-4">
              <FormButton
                text={t("snaps.report.submit")}
                onSubmit={handleSubmit}
                disabled={!reason}
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
