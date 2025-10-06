import { apiFetch } from "@/lib/fetch-api";
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

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.emit("locationChange", { coordinates: location.coordinates });

    socket.on("snap-added", (new_data: CreateSnapResponse) => {
      queryClient.setQueryData<FetchResponse<CreateSnapResponse[]>>(
        [
          "snaps",
          "near",
          location?.coordinates?.[0] ?? null,
          location?.coordinates?.[1] ?? null,
          handleArrayQueryParam(params.tags as string, "tags"),
        ],
        (old) => {
          if (!old || !old.success) return { success: true, data: [new_data] }; // TODO: handle and test this thorougly
          return { ...old, data: [...(old.data || []), new_data] };
        }
      );
    });

    return () => {
      socket.off("snap-added");
      socket.off("connect");
    };
  }, [location]);

  return useQuery({
    queryKey: [
      "snaps",
      "near",
      location?.coordinates?.[0],
      location?.coordinates?.[1],
      handleArrayQueryParam(params.tags as string, "tags"),
    ],
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    enabled: !!location.coordinates?.length && isFocused,
    queryFn: () =>
      apiFetch<CreateSnapResponse[]>({
        api: "snaps",
        url: `snaps/near/${location.coordinates[0]}/${location.coordinates[1]}${handleArrayQueryParam(params.tags as string, "tags")}`,
        options: {
          method: "GET",
        },
      }),
  });
};
