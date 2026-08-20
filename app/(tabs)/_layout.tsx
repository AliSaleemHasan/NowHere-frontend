import LocationRequired from "@/components/LocationRequired";
import { useAuth } from "@/features/auth/context/auth-store";
import { useLocation } from "@/features/snaps/context/location-store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable } from "react-native";

const TabsLayout = () => {
  const router = useRouter();
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const fetchLocation = useLocation((state) => state.featchLocation);

  const isLocationError = useLocation((state) => state.error);

  useEffect(() => {
    fetchLocation();
  }, []);

  if (isLocationError) return <LocationRequired withErrorImage />;

  // if (isLocationLoading)
  //   return (
  //     <Loading
  //       cause={`Location is loading ${isLocationError && "with this error" + isLocationError} `}
  //     />
  //   );

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
      ></Tabs.Screen>

      <Tabs.Screen
        name="add-snap"
        options={{
          tabBarLabel: "Add Snap",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="camera" size={20} color={color} />
          ),
          tabBarButton: (props) => {
            const { ref: _ref, ...rest } = props as any;
            return (
              <Pressable
                {...rest}
                onPress={() => {
                  router.push(
                    isLoggedIn ? "/(snaps)/snaps-capture" : "/(auth)/login",
                  );
                }}
              />
            );
          },
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
