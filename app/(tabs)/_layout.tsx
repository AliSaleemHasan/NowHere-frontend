import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
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
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-snap"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="camera" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
