import { askLocationPermission } from "@/lib/location";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  withErrorImage?: boolean;
  disabled?: boolean;
  onGranted: () => void | Promise<void>;
}

const LocationRequired = (props: Props) => {
  const { t } = useTranslation();
  const disabled = Boolean(props.disabled);

  const handleLocationPermission = async () => {
    if (disabled) return;
    const granted = await askLocationPermission();
    if (!granted) return;
    await props.onGranted();
  };

  return (
    <View
      className={`w-full items-center ${props.withErrorImage ? "flex flex-1 justify-center" : ""}`}
    >
      {props.withErrorImage && (
        <View className="relative h-44 w-44">
          <Image
            className="h-full w-full rounded-full"
            source={require("@/assets/images/location-required.png")}
            resizeMode="contain"
          />
        </View>
      )}
      <View
        className={`items-center ${props.withErrorImage ? "gap-5 p-4" : "gap-3 pt-1"}`}
      >
        <Text className="text-center text-sm">{t("location.grantBody")}</Text>
        <TouchableOpacity
          testID="grant-location-access"
          onPress={handleLocationPermission}
          disabled={disabled}
          accessibilityState={{ disabled }}
          className={`rounded-md p-4 ${disabled ? "bg-disabled" : "bg-alert"}`}
        >
          <Text className="text-sm text-white">{t("location.grantButton")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationRequired;
