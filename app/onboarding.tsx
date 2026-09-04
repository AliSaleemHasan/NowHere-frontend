import Modal from "@/components/Modal";
import ModalPage from "@/components/ModalPage";
import { LocationConsentView } from "@/features/snaps/components/LocationConsentView";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      className="bg-background"
      style={{
        paddingBottom: insets.bottom * 1.2,
      }}
    >
      <Modal pagesNumber={4}>
        <ModalPage
          description={t("onboarding.welcomeBody")}
          title={t("onboarding.welcomeTitle")}
          imageSource={require("@/assets/images/onboarding/welcome.png")}
        />
        <ModalPage
          description={t("onboarding.featuresBody")}
          title={t("onboarding.featuresTitle")}
          imageSource={require("@/assets/images/onboarding/features.jpg")}
        />
        <ModalPage
          description={t("onboarding.howBody")}
          title={t("onboarding.howTitle")}
          imageSource={require("@/assets/images/onboarding/how-it-work.png")}
        />
        <ModalPage
          largeContent
          description={t("onboarding.locationBody")}
          title={t("onboarding.locationTitle")}
          imageSource={require("@/assets/images/onboarding/location-required.png")}
        >
          <LocationConsentView />
        </ModalPage>
      </Modal>
    </View>
  );
}
