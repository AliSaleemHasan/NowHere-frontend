import { cn } from "@/utils";
import React, { useState } from "react";
import { Image, ImageResizeMode, View } from "react-native";

interface Props {
  uri: string;
  className: string;
  resizeMode?: ImageResizeMode;
}
export default function ImageWithSkeleton(props: Props) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <View
          className={cn(
            "absolute inset-0 bg-gray-200 justify-center items-center animate-pulse",
            props.className
          )}
        ></View>
      )}
      <Image
        source={{ uri: props.uri }}
        className={props.className}
        resizeMode={props.resizeMode || "cover"}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </>
  );
}
