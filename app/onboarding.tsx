import LocationRequired from "@/components/LocationRequired";
import Modal from "@/components/Modal";
import ModalPage from "@/components/ModalPage";
import { useLocation } from "@/features/snaps/context/location-store";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const fetchLocation = useLocation((state) => state.fetchLocation);

  return (
    <View
      className="bg-background"
      style={{
        paddingBottom: insets.bottom * 1.2,
      }}
    >
      <Modal pagesNumber={4}>
        <ModalPage
          description="Your window for what's near."
          title="Welcome to NowHere"
          imageSource={require("@/assets/images/onboarding/welcome.png")}
        />
        <ModalPage
          description="Stay connected with your surroundings — discover real-time updates, share valuable info, and explore nearby opportunities effortlessly."
          title="Keep up with everything near!"
          imageSource={require("@/assets/images/onboarding/features.jpg")}
        />
        <ModalPage
          description="See nearby snaps within your range for 24 hours. Search by tags, post once per area daily, and unlock extended reach and duration with premium."
          title="How It Works"
          imageSource={require("@/assets/images/onboarding/how-it-work.png")}
        />
        <ModalPage
          description="NowHere is about what’s around you. Allow location so we can show nearby snaps and attach your photos to this place."
          title="Location is required"
          imageSource={require("@/assets/images/onboarding/location-required.png")}
        >
          <LocationRequired onGranted={fetchLocation} />
        </ModalPage>
      </Modal>
    </View>
  );
}
