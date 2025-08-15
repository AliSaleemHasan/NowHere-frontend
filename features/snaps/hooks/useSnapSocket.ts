import { apiFetch } from "@/lib/fetch-api";
import { socket } from "@/lib/socket";
import { FetchResponse } from "@/types/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "../context/location-store";
import { CreateSnapResponse } from "../types/snaps-api-type";

export const useSnapSocket = () => {
  const queryClient = useQueryClient();
  const location = useLocation((state) => state.location);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.emit("locationChange", { coordinates: location.coordinates });

    socket.on("snap-added", (new_data: CreateSnapResponse) => {
      queryClient.setQueryData<FetchResponse<CreateSnapResponse[]>>(
        ["snaps", "near", location.coordinates[0], location.coordinates[1]],
        (old) => {
          if (!old || !old.success) return { success: true, data: [new_data] }; // TODO: handle and test this thorougly
          return { ...old, data: [...(old.data || []), new_data] };
        }
      );
    });

    return () => {
      socket.off("snap-added");
    };
  }, [location]);

  return useQuery({
    queryKey: [
      "snaps",
      "near",
      location.coordinates[0],
      location.coordinates[1],
    ],
    queryFn: () =>
      apiFetch<CreateSnapResponse[]>({
        url: `snaps/near/${location.coordinates[0]}/${location.coordinates[1]}`,
        options: {
          method: "GET",
        },
      }),
  });
};
