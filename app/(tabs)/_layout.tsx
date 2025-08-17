import { useAuth } from "@/features/auth/context/auth-store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
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
