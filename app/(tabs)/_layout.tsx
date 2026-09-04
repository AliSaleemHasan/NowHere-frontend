import LocationRequired from "@/components/LocationRequired";
import { SafeScreen } from "@/components/SafeScreen";
import { useAuth } from "@/features/auth/context/auth-store";
import {
  hasLocationConsent,
  useLocation,
} from "@/features/snaps/context/location-store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const unstable_settings = {
  initialRouteName: "index",
};

const TabsLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const fetchLocation = useLocation((state) => state.fetchLocation);
  const locationConsentAt = useLocation((state) => state.locationConsentAt);

  const isLocationError = useLocation((state) => state.error);

  useEffect(() => {
    if (!hasLocationConsent(locationConsentAt)) return;
    void fetchLocation();
  }, [fetchLocation, locationConsentAt]);

  if (isLocationError) {
    return (
      <SafeScreen edges={["top", "bottom"]} className="bg-white">
        <LocationRequired
          withErrorImage
          disabled={!hasLocationConsent(locationConsentAt)}
          onGranted={fetchLocation}
        />
      </SafeScreen>
    );
  }

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{ tabBarActiveTintColor: "black" }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: t("tabs.map"),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="map" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-snap"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();

            if (!isLoggedIn) {
              router.push("/(auth)/login");
              return;
            }

            router.push("/(snaps)/snaps-capture");
          },
        }}
        options={{
          tabBarLabel: t("tabs.addSnap"),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="camera" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Protected guard={isLoggedIn}>
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: t("tabs.profile"),
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={20} color={color} />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
};

export default TabsLayout;
