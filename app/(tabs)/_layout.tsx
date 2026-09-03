import LocationRequired from "@/components/LocationRequired";
import { useAuth } from "@/features/auth/context/auth-store";
import { useLocation } from "@/features/snaps/context/location-store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

const TabsLayout = () => {
  const router = useRouter();
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const fetchLocation = useLocation((state) => state.fetchLocation);

  const isLocationError = useLocation((state) => state.error);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  if (isLocationError) {
    return (
      <LocationRequired withErrorImage onGranted={fetchLocation} />
    );
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "black" }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: "Map",
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
          tabBarLabel: "Add Snap",
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
            tabBarLabel: "Profile",
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
