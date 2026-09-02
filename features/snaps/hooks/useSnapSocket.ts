import { apiHybridFetch } from "@/lib/fetch-api";
import { socket } from "@/lib/socket";
import { FetchResponse } from "@/types/api";
import { handleArrayQueryParam } from "@/utils/handle-array-query-param";
import { useIsFocused } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useLocation } from "../context/location-store";
import { CreateSnapResponse } from "../types/snaps-api-type";

export const useSnapSocket = () => {
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();
  const location = useLocation((state) => state.location);

  const [lng, lat] = location?.coordinates ?? [0, 0];
  const tagsParam = handleArrayQueryParam(params.tags as string, "tags");

  useEffect(() => {
    const handleSnapAdded = (new_data: CreateSnapResponse) => {
      queryClient.setQueriesData<FetchResponse<CreateSnapResponse[]>>(
        { queryKey: ["snaps", "near"] },
        (old) => {
          if (!old || !old.success) return { success: true, data: [new_data] };
          return { ...old, data: [...(old.data || []), new_data] };
        },
      );
    };

    socket.on("snap-added", handleSnapAdded);
    return () => {
      socket.off("snap-added", handleSnapAdded);
    };
  }, [queryClient]);

  useEffect(() => {
    if (!lng && !lat) return;

    const timeoutId = setTimeout(() => {
      if (socket.connected) {
        socket.emit("locationChange", { coordinates: [lng, lat] });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [lng, lat]);

  return useQuery({
    queryKey: ["snaps", "near", params.seen, lng, lat, tagsParam],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    throwOnError: false,
    enabled: !!(lng || lat) && isFocused,
    queryFn: () =>
      apiHybridFetch<CreateSnapResponse[]>({
        api: "snaps",
        url: `${params.seen === "1" ? "seen" : "near"}/${lng}/${lat}${tagsParam}`,
        options: {
          method: "GET",
        },
      }),
  });
};
