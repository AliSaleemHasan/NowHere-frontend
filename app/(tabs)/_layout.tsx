import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          backgroundColor: "#0f0d23",
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "0f0d23",
        },
      }}
    >
      <Tabs.Screen
        name="Map"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="map" color={color} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="Favorites"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="heart" size={20} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
