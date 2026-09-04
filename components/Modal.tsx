import { FontAwesome } from "@expo/vector-icons";
import React, { PropsWithChildren, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";


const { width: windowWidth } = Dimensions.get("window");

interface Props {
  pagesNumber: number;
}
export default function Modal({
  pagesNumber,
  children,
}: PropsWithChildren<Props>) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const translateX = useSharedValue(0);

  const handleNavigation = (next?: boolean) => {
    if ((currentPage === 0 && !next) || (currentPage === pagesNumber - 1 && next))
      return;
    setCurrentPage((currentPage) => (next ? currentPage + 1 : currentPage - 1));
    translateX.value = withSpring(
      -(next ? currentPage + 1 : currentPage - 1) * windowWidth,
      {
        damping: 15,

        stiffness: 120,
      }
    );
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="h-full  items-center ">
      <Animated.View
        style={[animatedStyles]}
        className="flex-row ml-auto  flex-1 items-center "
      >
        {children}
      </Animated.View>
      <View
        className={`flex-row gap-3  w-full px-5 justify-between items-center `}
      >
        <TouchableOpacity
          className={`rounded-lg bg-primary p-3 ${currentPage === 0 ? "opacity-0" : ""}`}
          onPress={() => handleNavigation()}
        >
          <FontAwesome color={"white"} name="backward"></FontAwesome>
        </TouchableOpacity>

        <View className="flex-row gap-3 ">
          {new Array(pagesNumber).fill("-").map((_, idx) => (
            <View
              key={idx}
              className={`rounded-full w-2 h-2 ${currentPage === idx ? "bg-primary border-none" : "border-primary border bg-background"}`}
            ></View>
          ))}
        </View>

        <TouchableOpacity
          className={` bg-primary p-3 rounded-lg ${currentPage + 1 === pagesNumber && "opacity-0"}`}
          onPress={() => handleNavigation(true)}
        >
          <FontAwesome color={"white"} name="forward"></FontAwesome>
        </TouchableOpacity>
      </View>
    </View>
  );
}
