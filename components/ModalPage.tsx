import React, { PropsWithChildren } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  View,
} from "react-native";

interface Props {
  imageSource: ImageSourcePropType | undefined;
  title: string;
  description: string;
  largeContent?: boolean;
}
export default function ModalPage({
  imageSource,
  title,
  description,
  children,
  largeContent,
}: PropsWithChildren<Props>) {
  return (
    <View className="h-full w-full items-center justify-center">
      <View className="h-full w-full items-center rounded-2xl">
        <View
          className={`w-full items-center justify-center bg-secondary ${largeContent ? "flex-[0.4]" : "flex-[0.7]"}`}
        >
          <Image
            source={imageSource}
            className="h-full w-full flex-1 shadow-lg"
            resizeMode="stretch"
          />
        </View>
        <View
          className={`w-full px-5 ${largeContent ? "flex-[0.6]" : "flex-[0.3]"}`}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="grow items-center justify-center gap-3 py-2"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-center font-semibold">{title}</Text>
            <Text className="text-center font-light">{description}</Text>
            {children}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
