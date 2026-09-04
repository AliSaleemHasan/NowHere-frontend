import LocationRequired from "@/components/LocationRequired";
import Checkbox from "expo-checkbox";
import { Link } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useLocation } from "../context/location-store";

function LocationConsentCheckbox({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <View className="w-full gap-2 px-1">
      <View className="flex-row items-start gap-3">
        <Checkbox
          testID="location-consent-checkbox"
          value={value}
          onValueChange={onChange}
          color={value ? "#0f0d23" : undefined}
          accessibilityLabel={t("consent.checkbox")}
        />
        <Text
          className="flex-1 text-xs leading-5 text-dark"
          onPress={() => onChange(!value)}
        >
          {t("consent.checkbox")}
        </Text>
      </View>
      <Link href="/privacy">
        <Text className="pl-8 text-xs text-primary underline">
          {t("consent.privacyLink")}
        </Text>
      </Link>
    </View>
  );
}

export function LocationConsentView({
  withErrorImage,
}: {
  withErrorImage?: boolean;
}) {
  const [checked, setChecked] = useState(false);
  const setLocationConsent = useLocation((state) => state.setLocationConsent);
  const fetchLocation = useLocation((state) => state.fetchLocation);

  return (
    <View className="w-full items-center gap-3">
      <LocationConsentCheckbox value={checked} onChange={setChecked} />
      <LocationRequired
        withErrorImage={withErrorImage}
        disabled={!checked}
        onGranted={async () => {
          setLocationConsent(true);
          await fetchLocation();
        }}
      />
    </View>
  );
}
