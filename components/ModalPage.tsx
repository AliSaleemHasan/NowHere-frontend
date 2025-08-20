import React, { PropsWithChildren } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  imageSource: ImageSourcePropType | undefined;
  title: string;
  description: string;
}
export default function ModalPage({
  imageSource,
  title,
  description,
  children,
}: PropsWithChildren<Props>) {
  return (
    <View className=" items-center  justify-center w-full     ">
      <View className={`w-full   h-full items-center   gap-4  rounded-2xl   `}>
        <View className="w-full flex-[0.7] bg-secondary items-center justify-center">
          <Image
            source={imageSource}
            className="flex-1 w-full h-full shadow-lg"
            resizeMode="stretch"
          ></Image>
        </View>
        <View className=" items-center justify-center px-5 flex-[0.3] gap-5">
          {children ? (
            children
          ) : (
            <>
              <Text className="font-semibold text-center ">{title}</Text>

              <Text className="font-light text-center">{description}</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
