import { useAuth } from "@/features/auth/context/auth-store";
import { apiAuthFetch } from "@/lib/fetch-api";
import {
  connectSnapSocket,
  disconnectSnapSocket,
  getSnapSocket,
} from "@/lib/socket";
import { expandTagsForQuery, handleArrayQueryParam, parseTagsParam } from "@/utils";
import { useIsFocused } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { snapQueryKeys, upsertNearSnap } from "../api/snap-query";
import { useLocation } from "../context/location-store";
import {
  CreateSnapResponse,
  isValidSnapLocation,
  normalizeSnap,
} from "../types/snaps-api-type";

export const useSnapSocket = () => {
  const params = useLocalSearchParams<{
    tags?: string | string[];
    seen?: string;
  }>();
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();
  const location = useLocation((state) => state.location);
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const accessToken = useAuth((state) => state.tokens?.accessToken);

  const hasLocation = isValidSnapLocation(location);
  const [lng, lat] = hasLocation ? location.coordinates : [0, 0];
  const selectedTags = expandTagsForQuery(parseTagsParam(params.tags));
  const tagsParam = handleArrayQueryParam(selectedTags, "tags");
  const showSeen = params.seen === "1";

  useEffect(() => {
    if (!isLoggedIn || !accessToken) {
      disconnectSnapSocket();
      return;
    }
    connectSnapSocket(accessToken);
    return undefined;
  }, [isLoggedIn, accessToken]);

  useEffect(() => {
    const socket = getSnapSocket();
    if (!socket) return;

    const handleSnapAdded = (payload: CreateSnapResponse) => {
      upsertNearSnap(queryClient, payload);
    };

    socket.on("snap-added", handleSnapAdded);
    return () => {
      socket.off("snap-added", handleSnapAdded);
    };
  }, [queryClient, accessToken]);

  useEffect(() => {
    if (!hasLocation) return;
    const socket = getSnapSocket();
    if (!socket) return;

    const emitLocation = () => {
      socket.emit("locationChange", {
        coordinates: [Number(lng), Number(lat)],
      });
    };

    if (socket.connected) emitLocation();
    socket.on("connect", emitLocation);

    return () => {
      socket.off("connect", emitLocation);
    };
  }, [lng, lat, hasLocation, accessToken]);

  return useQuery({
    queryKey: snapQueryKeys.nearList(showSeen, lng, lat, tagsParam),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    throwOnError: false,
    enabled: isLoggedIn && hasLocation && isFocused,
    queryFn: async () => {
      const response = await apiAuthFetch<CreateSnapResponse[]>({
        api: "snaps",
        url: `${showSeen ? "seen" : "near"}/${lng}/${lat}${tagsParam}`,
        options: {
          method: "GET",
        },
      });
      const list = Array.isArray(response.data) ? response.data : [];
      return {
        success: true as const,
        data: list
          .map((item) => normalizeSnap(item))
          .filter((item): item is CreateSnapResponse => item !== undefined),
      };
    },
  });
};
